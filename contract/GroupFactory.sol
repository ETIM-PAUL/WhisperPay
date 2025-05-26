contract GroupFactory {

    uint256 public groupCount;
    struct Group {
        string name;
        string description;
        uint256 targetAmount;
        uint256 endDate;
        uint256 uniqueId;
        address owner;
        uint256 createdAt;
        address groupAddress;
    }

    mapping(address => Group[]) public userGroups;

    event GroupCreated(address indexed owner, address groupAddress, string accessCode);

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
        Group newGroup = new Group(_name, _description, _targetAmount, _endDate, groupCount, msg.sender, block.timestamp, address(newGroup));
        address groupAddress = address(newGroup);

        userGroups[msg.sender].push(newGroup);

        emit GroupCreated(msg.sender, groupAddress, groupCount);
    }

    function getGroupsByUser(address _user) external view returns (address[] memory) {
        return userGroups[_user];
    }

}
