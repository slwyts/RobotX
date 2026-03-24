// SPDX-License-Identifier: MIT
pragma solidity =0.8.34;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract RXStaking is Ownable, ReentrancyGuard {
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant REWARD_TRANSFER_GAS = 5_000;
    uint256 public constant ENTRY_DIRECT_BONUS_BPS = 200;
    uint256 public constant EXIT_DIRECT_BONUS_BPS = 300;
    uint256 public constant MONTHLY_STATIC_RATE_BPS = 1_500;
    uint256 public constant MIN_STAKE_AMOUNT = 1_000 ether;
    uint256 public constant MIN_LOCK_DURATION = 10 days;
    uint256 public constant MAX_LOCK_DURATION = 200 days;
    uint256 public constant STATIC_RATE_PERIOD = 30 days;
    uint8 public constant MAX_TEAM_DEPTH = 10;

    error InvalidTeamLevel();
    error AlreadyBound();
    error InvalidUpline();
    error UplineNotBound();
    error BindUplineFirst();
    error InvalidStakeAmount();
    error InvalidLockDuration();
    error OrderNotFound();
    error OrderAlreadySettled();
    error UnauthorizedOrder();
    error InvalidAmount();
    error InsufficientContractBalance();
    error NativeTransferFailed();

    struct Account {
        address inviter;
        uint256 teamBusiness;
        uint256 directReferrals;
        uint256 totalDirectReward;
        uint256 totalTeamReward;
    }

    struct Order {
        address user;
        uint256 amountIn;
        uint256 principalAmount;
        uint256 startAt;
        uint256 endAt;
        bool settled;
        uint256 settledAt;
    }

    struct AccountView {
        address inviter;
        uint256 teamBusiness;
        uint256 directReferrals;
        uint256 orderCount;
        uint8 teamLevel;
        uint256 teamRewardBps;
        uint256 totalDirectReward;
        uint256 totalTeamReward;
    }

    struct Announcement {
        uint256 id;
        string locale;
        string title;
        string summary;
        string content;
        bool deleted;
        uint256 createdAt;
        uint256 updatedAt;
    }

    uint256 public nextOrderId = 1;
    uint256 public nextAnnouncementId = 1;
    uint256 public totalActiveStaked;

    mapping(address => Account) private accounts;
    mapping(uint256 => Order) private orders;
    mapping(address => uint256[]) private userOrderIds;
    mapping(address => address[]) private directMembers;
    mapping(uint256 => Announcement) private announcements;
    mapping(address => uint8) private teamLevelOverride;

    uint256[] private allOrderIds;
    uint256[] private announcementIds;

    event UplineBound(address indexed user, address indexed inviter);
    event Staked(
        uint256 indexed orderId,
        address indexed user,
        address indexed inviter,
        uint256 amountIn,
        uint256 principalAmount,
        uint256 entryDirectBonus,
        uint256 startAt,
        uint256 endAt
    );
    event OrderSettled(
        uint256 indexed orderId,
        address indexed user,
        uint256 finalOrderAmount,
        uint256 staticReward,
        uint256 exitDirectBonus,
        uint256 userSettlementAmount,
        uint256 actualProfit
    );
    event DirectRewardPaid(
        address indexed beneficiary,
        address indexed from,
        uint256 indexed orderId,
        uint256 amount,
        uint8 phase
    );
    event TeamRewardPaid(
        address indexed beneficiary,
        address indexed from,
        uint256 indexed orderId,
        uint256 generation,
        uint256 amount
    );
    event RewardTransferSkipped(
        address indexed beneficiary,
        uint256 indexed orderId,
        uint256 amount,
        uint8 rewardType,
        uint256 generation
    );
    event EmergencyWithdrawal(address indexed operator, uint256 amount);
    event AdminOrderCreated(uint256 indexed orderId, address indexed user, uint256 amountIn, uint256 principalAmount, uint256 startAt, uint256 endAt);
    event AdminOrderClosed(uint256 indexed orderId, address indexed user, uint256 settledAt);
    event AnnouncementWritten(uint256 indexed announcementId, string locale, bool deleted, uint256 updatedAt);
    event TeamLevelOverrideSet(address indexed user, uint8 level);

    constructor(address initialOwner) Ownable(initialOwner) {}

    receive() external payable {}

    function bindUpline(address inviter) external {
        Account storage account = accounts[msg.sender];
        if (account.inviter != address(0)) {
            revert AlreadyBound();
        }

        address resolvedInviter = inviter == address(0) ? owner() : inviter;
        if (resolvedInviter == address(0) || resolvedInviter == msg.sender) {
            revert InvalidUpline();
        }
        if (resolvedInviter != owner() && resolvedInviter != address(1) && accounts[resolvedInviter].inviter == address(0)) {
            revert UplineNotBound();
        }

        _assertNoCycle(msg.sender, resolvedInviter);

        account.inviter = resolvedInviter;
        accounts[resolvedInviter].directReferrals += 1;
        directMembers[resolvedInviter].push(msg.sender);

        emit UplineBound(msg.sender, resolvedInviter);
    }

    function stake(uint256 lockDurationDays) external payable nonReentrant returns (uint256 orderId) {
        if (msg.value < MIN_STAKE_AMOUNT) {
            revert InvalidStakeAmount();
        }

        uint256 duration = lockDurationDays * 1 days;
        if (duration < MIN_LOCK_DURATION || duration > MAX_LOCK_DURATION) {
            revert InvalidLockDuration();
        }

        address inviter = accounts[msg.sender].inviter;
        if (inviter == address(0)) {
            revert BindUplineFirst();
        }

        uint256 entryDirectBonus = Math.mulDiv(msg.value, ENTRY_DIRECT_BONUS_BPS, BPS_DENOMINATOR);
        uint256 principalAmount = msg.value - entryDirectBonus;

        orderId = nextOrderId;
        unchecked {
            nextOrderId = orderId + 1;
        }

        uint256 startAt = block.timestamp;
        uint256 endAt = startAt + duration;

        orders[orderId] = Order({
            user: msg.sender,
            amountIn: msg.value,
            principalAmount: principalAmount,
            startAt: startAt,
            endAt: endAt,
            settled: false,
            settledAt: 0
        });
        userOrderIds[msg.sender].push(orderId);
        allOrderIds.push(orderId);

        totalActiveStaked += principalAmount;

        if (inviter != address(0) && entryDirectBonus != 0) {
            _tryPayReward(inviter, orderId, entryDirectBonus, 1, 0);
        }

        _increaseTeamBusiness(msg.sender, msg.value);

        emit Staked(orderId, msg.sender, inviter, msg.value, principalAmount, entryDirectBonus, startAt, endAt);
    }

    function settleOrder(uint256 orderId) external nonReentrant returns (uint256 userSettlementAmount) {
        Order storage order = orders[orderId];
        if (order.user == address(0)) {
            revert OrderNotFound();
        }
        if (order.user != msg.sender) {
            revert UnauthorizedOrder();
        }
        if (order.settled) {
            revert OrderAlreadySettled();
        }

        uint256 staticReward = _pendingStaticReward(order);
        uint256 finalOrderAmount = order.principalAmount + staticReward;
        uint256 exitDirectBonus = 0;
        address inviter = accounts[msg.sender].inviter;
        if (inviter != address(0)) {
            exitDirectBonus = Math.mulDiv(finalOrderAmount, EXIT_DIRECT_BONUS_BPS, BPS_DENOMINATOR);
        }

        userSettlementAmount = finalOrderAmount - exitDirectBonus;
        uint256 actualProfit = 0;
        if (userSettlementAmount > order.amountIn) {
            actualProfit = userSettlementAmount - order.amountIn;
        }

        order.settled = true;
        order.settledAt = block.timestamp;

        totalActiveStaked -= order.principalAmount;

        if (exitDirectBonus != 0) {
            _tryPayReward(inviter, orderId, exitDirectBonus, 2, 0);
        }

        if (actualProfit != 0) {
            _payTeamRewards(msg.sender, orderId, actualProfit);
        }

        (bool success, ) = payable(msg.sender).call{value: userSettlementAmount}("");
        if (!success) {
            revert NativeTransferFailed();
        }

        emit OrderSettled(
            orderId,
            msg.sender,
            finalOrderAmount,
            staticReward,
            exitDirectBonus,
            userSettlementAmount,
            actualProfit
        );
    }

    function adminCreateOrder(address user, uint256 amountIn, uint256 lockDurationDays) external onlyOwner returns (uint256 orderId) {
        if (user == address(0)) {
            revert InvalidUpline();
        }
        if (amountIn < MIN_STAKE_AMOUNT) {
            revert InvalidStakeAmount();
        }

        uint256 duration = lockDurationDays * 1 days;
        if (duration < MIN_LOCK_DURATION || duration > MAX_LOCK_DURATION) {
            revert InvalidLockDuration();
        }

        uint256 principalAmount = amountIn - Math.mulDiv(amountIn, ENTRY_DIRECT_BONUS_BPS, BPS_DENOMINATOR);

        orderId = nextOrderId;
        unchecked {
            nextOrderId = orderId + 1;
        }

        uint256 startAt = block.timestamp;
        uint256 endAt = startAt + duration;

        orders[orderId] = Order({
            user: user,
            amountIn: amountIn,
            principalAmount: principalAmount,
            startAt: startAt,
            endAt: endAt,
            settled: false,
            settledAt: 0
        });
        userOrderIds[user].push(orderId);
        allOrderIds.push(orderId);

        totalActiveStaked += principalAmount;
        _increaseTeamBusiness(user, amountIn);

        emit AdminOrderCreated(orderId, user, amountIn, principalAmount, startAt, endAt);
    }

    function adminCloseOrder(uint256 orderId) external onlyOwner {
        Order storage order = orders[orderId];
        if (order.user == address(0)) {
            revert OrderNotFound();
        }
        if (order.settled) {
            revert OrderAlreadySettled();
        }

        order.settled = true;
        order.settledAt = block.timestamp;
        totalActiveStaked -= order.principalAmount;

        emit AdminOrderClosed(orderId, order.user, order.settledAt);
    }

    function writeAnnouncement(
        uint256 announcementId,
        string calldata locale,
        string calldata title,
        string calldata summary,
        string calldata content,
        bool deleted
    ) external onlyOwner returns (uint256 writtenId) {
        if (announcementId == 0) {
            writtenId = nextAnnouncementId;
            unchecked {
                nextAnnouncementId = writtenId + 1;
            }
            announcementIds.push(writtenId);
            announcements[writtenId].id = writtenId;
            announcements[writtenId].createdAt = block.timestamp;
        } else {
            writtenId = announcementId;
            if (announcements[writtenId].createdAt == 0) {
                revert OrderNotFound();
            }
        }

        Announcement storage announcement = announcements[writtenId];
        announcement.locale = locale;
        announcement.title = title;
        announcement.summary = summary;
        announcement.content = content;
        announcement.deleted = deleted;
        announcement.updatedAt = block.timestamp;

        emit AnnouncementWritten(writtenId, locale, deleted, announcement.updatedAt);
    }

    function emergencyWithdraw(uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }

        uint256 balance = address(this).balance;
        if (amount > balance) {
            revert InsufficientContractBalance();
        }

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert NativeTransferFailed();
        }

        emit EmergencyWithdrawal(msg.sender, amount);
    }

    function adminSetTeamLevel(address user, uint8 level) external onlyOwner {
        if (level > 6) {
            revert InvalidTeamLevel();
        }
        teamLevelOverride[user] = level + 1;
        emit TeamLevelOverrideSet(user, level);
    }

    function adminClearTeamLevel(address user) external onlyOwner {
        teamLevelOverride[user] = 0;
        emit TeamLevelOverrideSet(user, 0);
    }

    function getAccount(address user) external view returns (AccountView memory viewData) {
        Account storage account = accounts[user];
        (uint8 level, uint256 teamRewardBps) = _getEffectiveTeamTier(user);

        viewData = AccountView({
            inviter: account.inviter,
            teamBusiness: account.teamBusiness,
            directReferrals: account.directReferrals,
            orderCount: userOrderIds[user].length,
            teamLevel: level,
            teamRewardBps: teamRewardBps,
            totalDirectReward: account.totalDirectReward,
            totalTeamReward: account.totalTeamReward
        });
    }

    function getOrder(uint256 orderId) external view returns (Order memory) {
        Order memory order = orders[orderId];
        if (order.user == address(0)) {
            revert OrderNotFound();
        }

        return order;
    }

    function getUserOrderCount(address user) external view returns (uint256) {
        return userOrderIds[user].length;
    }

    function getAllOrderCount() external view returns (uint256) {
        return allOrderIds.length;
    }

    function getUserOrderIds(address user) external view returns (uint256[] memory) {
        return userOrderIds[user];
    }

    function getAllOrderIds(uint256 offset, uint256 limit) external view returns (uint256[] memory result) {
        uint256 count = allOrderIds.length;
        if (offset >= count) {
            return new uint256[](0);
        }

        uint256 endExclusive = offset + limit;
        if (limit == 0 || endExclusive > count) {
            endExclusive = count;
        }

        uint256 size = endExclusive - offset;
        result = new uint256[](size);
        for (uint256 i = 0; i < size; ++i) {
            result[i] = allOrderIds[offset + i];
        }
    }

    function getUserOrders(address user, uint256 offset, uint256 limit) external view returns (Order[] memory result) {
        uint256[] storage ids = userOrderIds[user];
        uint256 count = ids.length;
        if (offset >= count) {
            return new Order[](0);
        }

        uint256 endExclusive = offset + limit;
        if (limit == 0 || endExclusive > count) {
            endExclusive = count;
        }

        uint256 size = endExclusive - offset;
        result = new Order[](size);
        for (uint256 i = 0; i < size; ++i) {
            uint256 orderId = ids[offset + i];
            result[i] = orders[orderId];
        }
    }

    function getDirectMemberCount(address user) external view returns (uint256) {
        return directMembers[user].length;
    }

    function getDirectMembers(address user, uint256 offset, uint256 limit) external view returns (address[] memory result) {
        address[] storage members = directMembers[user];
        uint256 count = members.length;
        if (offset >= count) {
            return new address[](0);
        }

        uint256 endExclusive = offset + limit;
        if (limit == 0 || endExclusive > count) {
            endExclusive = count;
        }

        uint256 size = endExclusive - offset;
        result = new address[](size);
        for (uint256 i = 0; i < size; ++i) {
            result[i] = members[offset + i];
        }
    }

    function getAnnouncement(uint256 announcementId) external view returns (Announcement memory) {
        Announcement memory announcement = announcements[announcementId];
        if (announcement.createdAt == 0) {
            revert OrderNotFound();
        }

        return announcement;
    }

    function getAnnouncementIds() external view returns (uint256[] memory) {
        return announcementIds;
    }

    function getAnnouncements(uint256 offset, uint256 limit) external view returns (Announcement[] memory result) {
        uint256 count = announcementIds.length;
        if (offset >= count) {
            return new Announcement[](0);
        }

        uint256 endExclusive = offset + limit;
        if (limit == 0 || endExclusive > count) {
            endExclusive = count;
        }

        uint256 size = endExclusive - offset;
        result = new Announcement[](size);
        for (uint256 i = 0; i < size; ++i) {
            result[i] = announcements[announcementIds[offset + i]];
        }
    }

    function pendingStaticReward(uint256 orderId) external view returns (uint256) {
        Order storage order = orders[orderId];
        if (order.user == address(0)) {
            revert OrderNotFound();
        }

        return _pendingStaticReward(order);
    }

    function _getEffectiveTeamTier(address user) internal view returns (uint8 level, uint256 rewardBps) {
        uint8 ovr = teamLevelOverride[user];
        if (ovr != 0) {
            return _teamTierByLevel(ovr - 1);
        }
        return getTeamTier(accounts[user].teamBusiness);
    }

    function _teamTierByLevel(uint8 level) internal pure returns (uint8, uint256) {
        if (level >= 6) return (6, 2_000);
        if (level == 5) return (5, 1_700);
        if (level == 4) return (4, 1_300);
        if (level == 3) return (3, 1_100);
        if (level == 2) return (2, 800);
        if (level == 1) return (1, 500);
        return (0, 0);
    }

    function getTeamTier(uint256 teamBusiness) public pure returns (uint8 level, uint256 rewardBps) {
        if (teamBusiness >= 25_000_000 ether) {
            return (6, 2_000);
        }
        if (teamBusiness >= 10_000_000 ether) {
            return (5, 1_700);
        }
        if (teamBusiness >= 4_000_000 ether) {
            return (4, 1_300);
        }
        if (teamBusiness >= 1_500_000 ether) {
            return (3, 1_100);
        }
        if (teamBusiness >= 500_000 ether) {
            return (2, 800);
        }
        if (teamBusiness >= 100_000 ether) {
            return (1, 500);
        }
        return (0, 0);
    }

    function _pendingStaticReward(Order storage order) internal view returns (uint256) {
        uint256 effectiveEnd = order.settled ? order.settledAt : block.timestamp;
        if (effectiveEnd <= order.startAt) {
            return 0;
        }

        uint256 elapsed = Math.min(effectiveEnd, order.endAt) - order.startAt;
        return Math.mulDiv(
            order.principalAmount,
            MONTHLY_STATIC_RATE_BPS * elapsed,
            BPS_DENOMINATOR * STATIC_RATE_PERIOD
        );
    }

    function _payTeamRewards(address from, uint256 orderId, uint256 profitBase) internal {
        address cursor = accounts[from].inviter;
        uint256 highestPaidBps = 0;

        for (uint256 generation = 1; generation <= MAX_TEAM_DEPTH && cursor != address(0); ++generation) {
            (, uint256 rewardBps) = _getEffectiveTeamTier(cursor);

            if (rewardBps > highestPaidBps && userOrderIds[cursor].length > 0) {
                uint256 diffBps = rewardBps - highestPaidBps;
                uint256 rewardAmount = Math.mulDiv(profitBase, diffBps, BPS_DENOMINATOR);
                if (rewardAmount != 0) {
                    if (_tryLimitedNativeTransfer(cursor, rewardAmount)) {
                        accounts[cursor].totalTeamReward += rewardAmount;
                        emit TeamRewardPaid(cursor, from, orderId, generation, rewardAmount);
                    } else {
                        emit RewardTransferSkipped(cursor, orderId, rewardAmount, 3, generation);
                    }
                }
                highestPaidBps = rewardBps;
            }

            cursor = accounts[cursor].inviter;
        }
    }

    function _increaseTeamBusiness(address user, uint256 amount) internal {
        address cursor = accounts[user].inviter;

        for (uint256 generation = 1; generation <= MAX_TEAM_DEPTH && cursor != address(0); ++generation) {
            accounts[cursor].teamBusiness += amount;
            cursor = accounts[cursor].inviter;
        }
    }

    function _tryPayReward(address beneficiary, uint256 orderId, uint256 amount, uint8 rewardType, uint256 generation) internal {
        if (beneficiary == address(0) || amount == 0) {
            return;
        }

        if (_tryLimitedNativeTransfer(beneficiary, amount)) {
            accounts[beneficiary].totalDirectReward += amount;
            emit DirectRewardPaid(beneficiary, msg.sender, orderId, amount, rewardType);
        } else {
            emit RewardTransferSkipped(beneficiary, orderId, amount, rewardType, generation);
        }
    }

    function _tryLimitedNativeTransfer(address to, uint256 amount) internal returns (bool success) {
        (success, ) = payable(to).call{value: amount, gas: REWARD_TRANSFER_GAS}("");
    }

    function _assertNoCycle(address user, address inviter) internal view {
        address cursor = inviter;
        for (uint256 i = 0; i < 256 && cursor != address(0); ++i) {
            if (cursor == user) {
                revert InvalidUpline();
            }
            cursor = accounts[cursor].inviter;
        }
    }
}