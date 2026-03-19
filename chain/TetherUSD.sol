// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0 and Community Contracts commit b0ddd27
// Solidity 0.8.34, EVM Osaka, Optimization 100000

pragma solidity =0.8.34;

import {ERC20Freezable} from "@openzeppelin/community-contracts/token/ERC20/extensions/ERC20Freezable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Bridgeable} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Bridgeable.sol";

contract TetherUSD is ERC20, ERC20Bridgeable, AccessControl, ERC20Burnable, ERC20Pausable, ERC1363, ERC20Permit, ERC20Freezable {
    bytes32 public constant TOKEN_BRIDGE_ROLE = keccak256("TOKEN_BRIDGE_ROLE");
    error Unauthorized();
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant FREEZER_ROLE = keccak256("FREEZER_ROLE");

    constructor(address defaultAdmin, address tokenBridge, address pauser, address minter, address freezer)
        ERC20("Tether USD", "USDT")
        ERC20Permit("Tether USD")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(TOKEN_BRIDGE_ROLE, tokenBridge);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(FREEZER_ROLE, freezer);
    }

    function _checkTokenBridge(address caller) internal view override {
        if (!hasRole(TOKEN_BRIDGE_ROLE, caller)) revert Unauthorized();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function freeze(address user, uint256 amount) public onlyRole(FREEZER_ROLE) {
        _setFrozen(user, amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Freezable)
    {
        super._update(from, to, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC20Bridgeable, AccessControl, ERC1363)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}