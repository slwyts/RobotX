import { BrowserProvider, Contract, JsonRpcProvider, formatEther, parseEther } from "ethers";
import { appConfig } from "@/lib/web3/config";
import { rxStakingAbi, rxStakingAddress } from "@/lib/contracts/rx-staking";

export const ADMIN_UPLINE_SENTINEL = "0x0000000000000000000000000000000000000001";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

type AccountViewResult = {
  inviter: string;
  teamBusiness: bigint;
  directReferrals: bigint;
  orderCount: bigint;
  teamLevel: bigint;
  teamRewardBps: bigint;
  totalDirectReward: bigint;
  totalTeamReward: bigint;
};

type OrderResult = {
  user: string;
  amountIn: bigint;
  principalAmount: bigint;
  startAt: bigint;
  endAt: bigint;
  settled: boolean;
  settledAt: bigint;
};

type AnnouncementResult = {
  id: bigint;
  locale: string;
  title: string;
  summary: string;
  content: string;
  deleted: boolean;
  createdAt: bigint;
  updatedAt: bigint;
};

export type RxStakingAccountView = {
  inviter: string;
  teamBusiness: bigint;
  directReferrals: bigint;
  orderCount: bigint;
  teamLevel: bigint;
  teamRewardBps: bigint;
  totalDirectReward: bigint;
  totalTeamReward: bigint;
};

export type RxStakingOrderView = {
  id: bigint;
  user: string;
  amountIn: bigint;
  principalAmount: bigint;
  startAt: bigint;
  endAt: bigint;
  settled: boolean;
  settledAt: bigint;
  pendingStaticReward: bigint;
};

export type RxStakingSnapshot = {
  contractBalance: bigint;
  totalActiveStaked: bigint;
  owner: string;
  account: RxStakingAccountView | null;
  orders: RxStakingOrderView[];
};

export type RxStakingMemberProfile = {
  address: string;
  generation: number;
  account: RxStakingAccountView;
  orders: RxStakingOrderView[];
  directMembers: string[];
};

export type RxStakingAnnouncement = {
  id: bigint;
  locale: string;
  title: string;
  summary: string;
  content: string;
  deleted: boolean;
  createdAt: bigint;
  updatedAt: bigint;
};

type InjectedProvider = {
  request: (request: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
};

function getInjectedProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as typeof window & { ethereum?: InjectedProvider }).ethereum ?? null;
}

function getReadProvider() {
  return new JsonRpcProvider(appConfig.targetChain.rpcUrl, appConfig.targetChain.chainId);
}

function getReadContract() {
  return new Contract(rxStakingAddress, rxStakingAbi, getReadProvider());
}

async function getWriteContract() {
  const injectedProvider = getInjectedProvider();
  if (!injectedProvider) {
    throw new Error("Injected wallet not found");
  }

  const browserProvider = new BrowserProvider(injectedProvider as never);
  const signer = await browserProvider.getSigner();
  return new Contract(rxStakingAddress, rxStakingAbi, signer);
}

function normalizeAccountView(result: AccountViewResult): RxStakingAccountView {
  return {
    inviter: result.inviter,
    teamBusiness: result.teamBusiness,
    directReferrals: result.directReferrals,
    orderCount: result.orderCount,
    teamLevel: result.teamLevel,
    teamRewardBps: result.teamRewardBps,
    totalDirectReward: result.totalDirectReward,
    totalTeamReward: result.totalTeamReward,
  };
}

function normalizeOrder(id: bigint, order: OrderResult, pendingStaticReward: bigint): RxStakingOrderView {
  return {
    id,
    user: order.user,
    amountIn: order.amountIn,
    principalAmount: order.principalAmount,
    startAt: order.startAt,
    endAt: order.endAt,
    settled: order.settled,
    settledAt: order.settledAt,
    pendingStaticReward,
  };
}

function normalizeAnnouncement(result: AnnouncementResult): RxStakingAnnouncement {
  return {
    id: result.id,
    locale: result.locale,
    title: result.title,
    summary: result.summary,
    content: result.content,
    deleted: result.deleted,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

async function readOrdersForAccount(contract: Contract, account: string) {
  const orderIds = await (contract.getUserOrderIds(account) as Promise<bigint[]>);

  return Promise.all(
    [...orderIds].reverse().map(async (orderId) => {
      const [order, pendingStaticReward] = await Promise.all([
        contract.getOrder(orderId) as Promise<OrderResult>,
        contract.pendingStaticReward(orderId) as Promise<bigint>,
      ]);

      return normalizeOrder(orderId, order, pendingStaticReward);
    }),
  );
}

export function formatRxAmount(value: bigint, fractionDigits = 4) {
  return Number(formatEther(value)).toFixed(fractionDigits);
}

export async function readContractBalance() {
  const provider = getReadProvider();
  return provider.getBalance(rxStakingAddress);
}

export async function readAccountView(account: string) {
  const contract = getReadContract();
  const accountView = await (contract.getAccount(account) as Promise<AccountViewResult>);
  return normalizeAccountView(accountView);
}

export async function readDirectMembers(account: string) {
  const contract = getReadContract();
  return await (contract.getDirectMembers(account, 0, 0) as Promise<string[]>);
}

export async function readMemberProfile(account: string, generation = 1): Promise<RxStakingMemberProfile> {
  const contract = getReadContract();
  const [accountView, directMembers, orders] = await Promise.all([
    contract.getAccount(account) as Promise<AccountViewResult>,
    contract.getDirectMembers(account, 0, 0) as Promise<string[]>,
    readOrdersForAccount(contract, account),
  ]);

  return {
    address: account,
    generation,
    account: normalizeAccountView(accountView),
    orders,
    directMembers,
  };
}

export async function readMemberNetwork(rootAccount: string, maxDepth = 10) {
  const directMembers = await readDirectMembers(rootAccount);
  const directProfiles = await Promise.all(directMembers.map((member) => readMemberProfile(member, 1)));

  const communityProfiles: RxStakingMemberProfile[] = [];
  let frontier = directProfiles;

  for (let generation = 2; generation <= maxDepth && frontier.length > 0; generation += 1) {
    const nextAddresses = frontier.flatMap((member) => member.directMembers);
    if (nextAddresses.length === 0) {
      break;
    }

    const nextProfiles = await Promise.all(nextAddresses.map((member) => readMemberProfile(member, generation)));
    communityProfiles.push(...nextProfiles);
    frontier = nextProfiles;
  }

  return {
    directProfiles,
    communityProfiles,
  };
}

export async function readStakingSnapshot(account?: string | null): Promise<RxStakingSnapshot> {
  const contract = getReadContract();
  const contractBalancePromise = readContractBalance();
  const ownerPromise = contract.owner() as Promise<string>;
  const totalActiveStakedPromise = contract.totalActiveStaked() as Promise<bigint>;

  if (!account) {
    const [contractBalance, totalActiveStaked, owner] = await Promise.all([
      contractBalancePromise,
      totalActiveStakedPromise,
      ownerPromise,
    ]);
    return {
      contractBalance,
      totalActiveStaked,
      owner,
      account: null,
      orders: [],
    };
  }

  const [contractBalance, totalActiveStaked, owner, accountView, orderIds] = await Promise.all([
    contractBalancePromise,
    totalActiveStakedPromise,
    ownerPromise,
    contract.getAccount(account) as Promise<AccountViewResult>,
    contract.getUserOrderIds(account) as Promise<bigint[]>,
  ]);

  const normalizedAccount = normalizeAccountView(accountView);
  const orders = await readOrdersForAccount(contract, account);

  return {
    contractBalance,
    totalActiveStaked,
    owner,
    account: normalizedAccount,
    orders,
  };
}

export async function readAnnouncements() {
  const contract = getReadContract();
  const results = await (contract.getAnnouncements(0, 0) as Promise<AnnouncementResult[]>);
  return results.map(normalizeAnnouncement);
}

export async function readAnnouncement(announcementId: bigint) {
  const contract = getReadContract();
  const result = await (contract.getAnnouncement(announcementId) as Promise<AnnouncementResult>);
  return normalizeAnnouncement(result);
}

export async function readAllOrders() {
  const contract = getReadContract();
  const orderIds = await (contract.getAllOrderIds(0, 0) as Promise<bigint[]>);

  return Promise.all(
    [...orderIds].reverse().map(async (orderId) => {
      const [order, pendingStaticReward] = await Promise.all([
        contract.getOrder(orderId) as Promise<OrderResult>,
        contract.pendingStaticReward(orderId) as Promise<bigint>,
      ]);

      return normalizeOrder(orderId, order, pendingStaticReward);
    }),
  );
}

export async function bindUpline(inviter: string) {
  const contract = await getWriteContract();
  const tx = await contract.bindUpline(inviter);
  await tx.wait();
}

export async function stakeRx(lockDurationDays: number, amountInEther: string) {
  const contract = await getWriteContract();
  const tx = await contract.stake(lockDurationDays, {
    value: parseEther(amountInEther),
  });
  await tx.wait();
}

export async function settleOrder(orderId: bigint) {
  const contract = await getWriteContract();
  const tx = await contract.settleOrder(orderId);
  await tx.wait();
}

export async function adminCreateOrder(user: string, amountInEther: string, lockDurationDays: number) {
  const contract = await getWriteContract();
  const tx = await contract.adminCreateOrder(user, parseEther(amountInEther), lockDurationDays);
  await tx.wait();
}

export async function adminCloseOrder(orderId: bigint) {
  const contract = await getWriteContract();
  const tx = await contract.adminCloseOrder(orderId);
  await tx.wait();
}

export async function writeAnnouncement(params: {
  announcementId?: bigint;
  locale: string;
  title: string;
  summary: string;
  content: string;
  deleted?: boolean;
}) {
  const contract = await getWriteContract();
  const tx = await contract.writeAnnouncement(
    params.announcementId ?? 0n,
    params.locale,
    params.title,
    params.summary,
    params.content,
    params.deleted ?? false,
  );
  await tx.wait();
}

export async function fundPool(amountInEther: string) {
  const injectedProvider = getInjectedProvider();
  if (!injectedProvider) {
    throw new Error("Injected wallet not found");
  }

  const browserProvider = new BrowserProvider(injectedProvider as never);
  const signer = await browserProvider.getSigner();
  const tx = await signer.sendTransaction({
    to: rxStakingAddress,
    value: parseEther(amountInEther),
  });
  await tx.wait();
}

export async function emergencyWithdraw(amountInEther: string) {
  const contract = await getWriteContract();
  const tx = await contract.emergencyWithdraw(parseEther(amountInEther));
  await tx.wait();
}