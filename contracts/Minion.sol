pragma solidity ^0.5.0;

contract Minion {
    string public name = "Minion Token";
    string public symbol = "MIN";
    string public standard = "Minion Token v1.0";
    uint8 public decimals = 2;
    uint256 public totalSupply = 10000 * (uint256(10)**decimals);

    mapping(address => uint256) public balanceOf;

    // Allowance: owner: { spender: value }
    // The value can be spent by spender that allowed by owner
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address _from, address _to, uint256 _amount);
    event Approval(address indexed _owner, address indexed _spender, uint256 _amount);

    constructor() public {
        // Send all Minion to owner
        balanceOf[msg.sender] = totalSupply;

        // Emit Transfer event
        emit Transfer(address(this), msg.sender, totalSupply);
    }

    // Transfer function
    function transfer(address _to, uint256 _amount)
        public
        returns (bool _success)
    {
        // Require sender has enough tokens
        _success = (balanceOf[msg.sender] >= _amount);
        require(_success, "Insufficient balance of sender");

        // Update balance
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;

        // Emit Transfer event
        emit Transfer(msg.sender, _to, _amount);

        return _success;
    }

    // Approve function
    // Called by owner, to pass in the spender and value of allowance
    function approve(address _spender, uint256 _amount)
        public
        returns (bool _success)
    {
        _success = (balanceOf[msg.sender] >= _amount);
        require(_success, "Insufficient balance of owner");

        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);

        return _success;
    }

    // TransferFrom function
    // Called by spender, to pass in the owner, receiver and value to transfer
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool _success) {
        // Require from account has enough tokens
        _success = (_amount <= balanceOf[_from]);
        require(_success, "Insufficient balance of owner");

        // Require allowance is big enough
        _success = (_amount <= allowance[_from][msg.sender]);
        require(_success, "Insufficient allowance for spender");

        // Change the balance
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;

        // Update the allowance
        allowance[_from][msg.sender] -= _amount;

        // Transfer event
        emit Transfer(_from, _to, _amount);

        return _success;
    }
}
