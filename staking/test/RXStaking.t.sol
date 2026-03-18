// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {RXStaking} from "../contracts/RXStaking.sol";

contract RejectEtherReceiver {
    receive() external payable {
        revert("reject ether");
    }
}

contract RXStakingTest is Test {
    event RewardTransferSkipped(
        address indexed beneficiary,
        uint256 indexed orderId,
        uint256 amount,
        uint8 rewardType,
        uint256 generation
    );

    event AnnouncementWritten(uint256 indexed announcementId, string locale, bool deleted, uint256 updatedAt);

    uint256 internal constant STAKE_AMOUNT = 1_000 ether;
    uint256 internal constant LARGE_STAKE_AMOUNT = 100_000 ether;
    uint256 internal constant FUNDING_AMOUNT = 1_000_000 ether;

    RXStaking internal staking;
    RejectEtherReceiver internal rejector;

    address internal owner;
    address internal alice;
    address internal bob;
    address internal carol;

    function setUp() public {
        owner = makeAddr("owner");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        carol = makeAddr("carol");

        vm.deal(owner, FUNDING_AMOUNT * 2);
        vm.deal(alice, FUNDING_AMOUNT);
        vm.deal(bob, FUNDING_AMOUNT);
        vm.deal(carol, FUNDING_AMOUNT);

        staking = new RXStaking(owner);
        rejector = new RejectEtherReceiver();

        _fundPool(FUNDING_AMOUNT);
    }

    function testBindAndStakeConstraints() public {
        vm.expectRevert(RXStaking.BindUplineFirst.selector);
        vm.prank(alice);
        staking.stake{value: STAKE_AMOUNT}(30);

        vm.expectRevert(RXStaking.InvalidUpline.selector);
        vm.prank(alice);
        staking.bindUpline(alice);

        vm.prank(alice);
        staking.bindUpline(address(0));

        address[] memory ownerDirectMembers = staking.getDirectMembers(owner, 0, 10);
        assertEq(ownerDirectMembers.length, 1);
        assertEq(ownerDirectMembers[0], alice);

        vm.expectRevert(RXStaking.UplineNotBound.selector);
        vm.prank(bob);
        staking.bindUpline(carol);

        vm.prank(bob);
        staking.bindUpline(alice);

        address[] memory aliceDirectMembers = staking.getDirectMembers(alice, 0, 10);
        assertEq(aliceDirectMembers.length, 1);
        assertEq(aliceDirectMembers[0], bob);

        RXStaking.AccountView memory account = staking.getAccount(alice);
        assertEq(account.inviter, owner);
        assertEq(account.directReferrals, 1);

        vm.expectRevert(RXStaking.AlreadyBound.selector);
        vm.prank(alice);
        staking.bindUpline(owner);

        vm.expectRevert(RXStaking.InvalidStakeAmount.selector);
        vm.prank(alice);
        staking.stake{value: STAKE_AMOUNT - 1}(30);

        vm.expectRevert(RXStaking.InvalidLockDuration.selector);
        vm.prank(alice);
        staking.stake{value: STAKE_AMOUNT}(9);

        vm.expectRevert(RXStaking.InvalidLockDuration.selector);
        vm.prank(alice);
        staking.stake{value: STAKE_AMOUNT}(201);

        vm.prank(carol);
        staking.bindUpline(bob);

        vm.prank(alice);
        uint256 orderId = staking.stake{value: STAKE_AMOUNT}(30);

        RXStaking.Order memory order = staking.getOrder(orderId);
        assertEq(order.user, alice);
        assertEq(order.amountIn, STAKE_AMOUNT);
        assertEq(order.principalAmount, _principal(STAKE_AMOUNT));
        assertEq(order.endAt - order.startAt, 30 days);
        assertEq(staking.getUserOrderCount(alice), 1);
    }

    function testEarlySettlementWithoutProfitSkipsTeamReward() public {
        _bindDefault(alice);
        _bind(bob, alice);

        uint256 aliceBalanceBefore = alice.balance;
        uint256 bobBalanceBefore = bob.balance;

        vm.prank(bob);
        uint256 orderId = staking.stake{value: STAKE_AMOUNT}(10);

        uint256 entryDirectReward = Math.mulDiv(STAKE_AMOUNT, 200, 10_000);
        assertEq(alice.balance - aliceBalanceBefore, entryDirectReward);

        vm.warp(block.timestamp + 1 days);

        RXStaking.Order memory orderBeforeSettle = staking.getOrder(orderId);
        uint256 staticReward = _staticReward(orderBeforeSettle.principalAmount, 1 days);
        uint256 finalOrderAmount = orderBeforeSettle.principalAmount + staticReward;
        uint256 exitDirectReward = Math.mulDiv(finalOrderAmount, 300, 10_000);
        uint256 expectedUserSettlement = finalOrderAmount - exitDirectReward;

        vm.prank(bob);
        staking.settleOrder(orderId);

        assertEq(alice.balance - aliceBalanceBefore, entryDirectReward + exitDirectReward);
        assertEq(bob.balance, bobBalanceBefore - STAKE_AMOUNT + expectedUserSettlement);

        RXStaking.Order memory settledOrder = staking.getOrder(orderId);
        assertTrue(settledOrder.settled);

        vm.expectRevert(RXStaking.OrderAlreadySettled.selector);
        vm.prank(bob);
        staking.settleOrder(orderId);
    }

    function testMatureSettlementPaysDirectAndTeamRewards() public {
        _bindDefault(alice);
        _bind(bob, alice);

        uint256 ownerBalanceBefore = owner.balance;
        uint256 aliceBalanceBefore = alice.balance;
        uint256 bobBalanceBefore = bob.balance;

        vm.prank(bob);
        uint256 orderId = staking.stake{value: LARGE_STAKE_AMOUNT}(30);

        uint256 entryDirectReward = Math.mulDiv(LARGE_STAKE_AMOUNT, 200, 10_000);
        assertEq(alice.balance - aliceBalanceBefore, entryDirectReward);

        vm.warp(block.timestamp + 30 days);

        RXStaking.Order memory orderBeforeSettle = staking.getOrder(orderId);
        uint256 staticReward = _staticReward(orderBeforeSettle.principalAmount, 30 days);
        uint256 finalOrderAmount = orderBeforeSettle.principalAmount + staticReward;
        uint256 exitDirectReward = Math.mulDiv(finalOrderAmount, 300, 10_000);
        uint256 expectedUserSettlement = finalOrderAmount - exitDirectReward;
        uint256 actualProfit = expectedUserSettlement - LARGE_STAKE_AMOUNT;
        uint256 expectedTeamReward = Math.mulDiv(actualProfit, 500, 10_000);

        vm.prank(bob);
        staking.settleOrder(orderId);

        assertEq(bob.balance, bobBalanceBefore - LARGE_STAKE_AMOUNT + expectedUserSettlement);
        assertEq(alice.balance - aliceBalanceBefore, entryDirectReward + exitDirectReward + expectedTeamReward);
        assertEq(owner.balance - ownerBalanceBefore, expectedTeamReward);
    }

    function testRewardTransferFailureDoesNotRevertFlow() public {
        address rejectorAddress = address(rejector);

        vm.prank(rejectorAddress);
        staking.bindUpline(owner);

        vm.prank(alice);
        staking.bindUpline(rejectorAddress);

        uint256 expectedSkippedEntryReward = Math.mulDiv(STAKE_AMOUNT, 200, 10_000);

        vm.expectEmit(true, true, true, true, address(staking));
        emit RewardTransferSkipped(rejectorAddress, 1, expectedSkippedEntryReward, 1, 0);

        vm.prank(alice);
        uint256 orderId = staking.stake{value: STAKE_AMOUNT}(30);

        assertEq(rejectorAddress.balance, 0);

        vm.warp(block.timestamp + 30 days);

        vm.prank(alice);
        staking.settleOrder(orderId);

        assertEq(rejectorAddress.balance, 0);

        RXStaking.Order memory order = staking.getOrder(orderId);
        assertTrue(order.settled);
    }

    function testOwnerFundingAndEmergencyWithdraw() public {
        vm.prank(alice);
        (bool nonOwnerFunded, ) = address(staking).call{value: 1 ether}("");
        assertTrue(nonOwnerFunded);

        uint256 ownerBalanceBeforeFunding = owner.balance;
        _fundPool(10 ether);
        assertEq(owner.balance, ownerBalanceBeforeFunding - 10 ether);

        vm.expectRevert();
        vm.prank(alice);
        staking.emergencyWithdraw(1 ether);

        uint256 ownerBalanceBeforeWithdraw = owner.balance;
        vm.prank(owner);
        staking.emergencyWithdraw(5 ether);
        assertEq(owner.balance, ownerBalanceBeforeWithdraw + 5 ether);
    }

    function testAdminCreateCloseOrderAndAnnouncements() public {
        vm.prank(alice);
        staking.bindUpline(address(0));

        vm.prank(owner);
        uint256 orderId = staking.adminCreateOrder(alice, STAKE_AMOUNT, 30);

        RXStaking.Order memory order = staking.getOrder(orderId);
        assertEq(order.user, alice);
        assertEq(order.amountIn, STAKE_AMOUNT);
        assertFalse(order.settled);

        uint256[] memory allOrderIds = staking.getAllOrderIds(0, 0);
        assertEq(allOrderIds.length, 1);
        assertEq(allOrderIds[0], orderId);

        vm.prank(owner);
        staking.adminCloseOrder(orderId);

        RXStaking.Order memory closedOrder = staking.getOrder(orderId);
        assertTrue(closedOrder.settled);

        vm.prank(owner);
        uint256 announcementId = staking.writeAnnouncement(0, "zh", unicode"标题", unicode"摘要", unicode"# 正文", false);

        RXStaking.Announcement memory announcement = staking.getAnnouncement(announcementId);
        assertEq(announcement.id, announcementId);
        assertEq(announcement.locale, "zh");
        assertEq(announcement.title, unicode"标题");
        assertEq(announcement.summary, unicode"摘要");
        assertEq(announcement.content, unicode"# 正文");
        assertFalse(announcement.deleted);

        vm.prank(owner);
        staking.writeAnnouncement(announcementId, "zh", unicode"标题2", unicode"摘要2", unicode"# 正文2", true);

        RXStaking.Announcement memory updatedAnnouncement = staking.getAnnouncement(announcementId);
        assertEq(updatedAnnouncement.title, unicode"标题2");
        assertTrue(updatedAnnouncement.deleted);
    }

    function _bindDefault(address user) internal {
        vm.prank(user);
        staking.bindUpline(address(0));
    }

    function _bind(address user, address inviter) internal {
        vm.prank(user);
        staking.bindUpline(inviter);
    }

    function _fundPool(uint256 amount) internal {
        vm.prank(owner);
        (bool success, ) = address(staking).call{value: amount}("");
        require(success, "owner funding failed");
    }

    function _principal(uint256 amount) internal pure returns (uint256) {
        return Math.mulDiv(amount, 9_800, 10_000);
    }

    function _staticReward(uint256 principalAmount, uint256 elapsed) internal pure returns (uint256) {
        return Math.mulDiv(principalAmount, 1_500 * elapsed, 10_000 * 30 days);
    }
}