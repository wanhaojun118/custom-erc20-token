pragma solidity ^0.5.0;

contract NewToken {
    string public name = "New Token";
    string public symbol = "N3w";
    string public standard = "New Token v1.0";
    uint256 public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Approve event
    // Emit when owner approves spender to send certain amount of value
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    // Allowance
    // Annotated by "allowance[owner][spender]"
    mapping(address => mapping(address => uint256)) public allowance;

    // Constructor
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        // allocate the initial supply
    }

    // Transfer
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Exception if account doesn't have enough
        require(balanceOf[msg.sender] >= _value);

        // Transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // Transfer Event
        emit Transfer(msg.sender, _to, _value);

        // Return boolean
        return true;
    }

    // Approve function
    // Called by owner, to pass in the spendre and value of allowance
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // TransferFrom function
    // Called by spender, to pass in the owner, receiver and value to transfer
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // Require from account has enough tokens
        require(_value <= balanceOf[_from]);

        // Require allowance is big enough
        require(_value <= allowance[_from][msg.sender]);

        // Change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the allowance
        allowance[_from][msg.sender] -= _value;

        // Transfer event
        emit Transfer(_from, _to, _value);

        return true;
    }
}
