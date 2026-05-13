// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RobotXBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public depositNonce;
    bool public paused;

    event Deposit(
        address indexed sender,
        address indexed token,
        uint256 amount,
        string destAddress,
        uint256 nonce
    );

    event Withdrawal(address indexed token, uint256 amount, address indexed to);

    modifier whenNotPaused() {
        require(!paused, "Bridge: paused");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function depositNative(string calldata destAddress) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Bridge: zero amount");
        require(bytes(destAddress).length > 0, "Bridge: empty dest");
        emit Deposit(msg.sender, address(0), msg.value, destAddress, depositNonce);
        depositNonce++;
    }

    function depositToken(address token, uint256 amount, string calldata destAddress) external nonReentrant whenNotPaused {
        require(amount > 0, "Bridge: zero amount");
        require(bytes(destAddress).length > 0, "Bridge: empty dest");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, token, amount, destAddress, depositNonce);
        depositNonce++;
    }

    function withdraw(address token, uint256 amount, address to) external onlyOwner {
        require(to != address(0), "Bridge: zero address");
        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "Bridge: ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
        emit Withdrawal(token, amount, to);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    receive() external payable {}
}
