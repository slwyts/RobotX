// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
// Solidity 0.8.34, EVM Osaka, Optimization 100000
pragma solidity =0.8.34;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @custom:security-contact security@robotxhub.ai
contract WrappedRobotX is ERC20, ERC1363, ERC20Permit {
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    error NativeTransferFailed();

    constructor() ERC20("Wrapped RobotX", "WRX") ERC20Permit("Wrapped RobotX") {}

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }


    function withdraw(uint256 wad) public {
        _burn(msg.sender, wad);
        
        (bool success, ) = msg.sender.call{value: wad}("");
        if (!success) {
            revert NativeTransferFailed();
        }
        
        emit Withdrawal(msg.sender, wad);
    }
}