// SPDX-License-Identifier: MIT
// Solidity 0.8.34, EVM Osaka, Optimization 2000
// 0x9999999999999999999999999999999999999999
pragma solidity =0.8.34;

contract ValidatorSet {
    address[] public dynamicValidators;
    address public admin;
    bool public initialized;

    address public constant FALLBACK_VALIDATOR = 0x3bb0D536BBcE0eda5a1cE99A10A8B18B8CDeDa6c;
    address public constant initializer = 0x95389Efa0cA6A8b0F25450f4531Eb66409E9ff46;

    function initialize() public {
        require(!initialized, "Already initialized");
        require(msg.sender == initializer, "Only initializer can call");
        
        admin = initializer;
        initialized = true;
        dynamicValidators.push(FALLBACK_VALIDATOR);
    }

    function addValidator(address _validator) public {
        require(msg.sender == admin, "Only admin can add");
        dynamicValidators.push(_validator);
    }

    function removeValidator(uint index) public {
        require(msg.sender == admin, "Only admin can remove");
        require(index < dynamicValidators.length, "Index out of bounds");
        
        dynamicValidators[index] = dynamicValidators[dynamicValidators.length - 1];
        dynamicValidators.pop();
    }

    function getValidators() public view returns (address[] memory) {
        if (dynamicValidators.length == 0) {
            address[] memory fallbackList = new address[](1);
            fallbackList[0] = FALLBACK_VALIDATOR;
            return fallbackList;
        }
        return dynamicValidators;
    }
}