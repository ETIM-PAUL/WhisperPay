// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "group.sol";

contract GroupFactory {

    uint256 public groupCount;

    struct GroupDetails {
        string name;
        string description;
        uint256 targetAmount;
        uint256 endDate;
        uint256 uniqueId;
        address owner;
        uint256 createdAt;
    }

    GroupDetails[] public allGroups;

    event GroupCreated(address indexed owner, address groupAddress, uint256 indexed groupId);

    function createGroup(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _endDate
    ) external {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_endDate > block.timestamp, "End date must be in the future");
        require(bytes(_name).length > 0, "Name must be non-empty");
        require(bytes(_description).length > 0, "Description must be non-empty");

        groupCount++;
        Group newGroup = new Group(_name, _description, _targetAmount, _endDate, groupCount, msg.sender, block.timestamp);
        address groupAddress = address(newGroup);

        allGroups.push(GroupDetails({
            name: _name,
            description: _description,
            targetAmount: _targetAmount,
            endDate: _endDate,
            uniqueId: groupCount,
            owner: msg.sender,
            createdAt: block.timestamp
        }));


        emit GroupCreated(msg.sender, groupAddress, groupCount);
    }


}
