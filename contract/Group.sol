// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Group {
    string public name;
    string public description;
    uint256 public targetAmount;
    uint256 public endDate;
    uint256 public uniqueId;
    address public owner;
    uint256 public createdAt;
    address public groupAddress;

    constructor(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _endDate,
        uint256 _uniqueId,
        address _owner,
        uint256 _createdAt,
        address _groupAddress
    ) {
        name = _name;
        description = _description;
        targetAmount = _targetAmount;
        endDate = _endDate;
        uniqueId = _uniqueId;
        owner = _owner;
        createdAt = _createdAt;
        groupAddress = _groupAddress;
    }

    function getGroupInfo() external view returns (
        string memory, string memory, uint256, uint256, uint256, address, uint256, address
    ) {
        return (name, description, targetAmount, endDate, uniqueId, owner, createdAt, groupAddress);
    }

    
}
