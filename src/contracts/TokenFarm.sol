pragma solidity >=0.4.22 <0.8.0;

import "./AlphaToken.sol";
import "./BetaToken.sol";

contract TokenFarm {
    string public name = "Yield Farming";
    address public owner;
    BetaToken public betaToken;
    AlphaToken public alphaToken;

    address[] public stakers;
    mapping (address => uint) public stakingBalance;
    mapping (address => bool) public hasStaked;

    constructor( BetaToken _betaToken, AlphaToken _alphaToken) public {
        betaToken = _betaToken;
        alphaToken = _alphaToken;
        owner = msg.sender;
    }

    // Stake Tokens
    function stakeTokens(uint _amount) public {
        require(_amount > 0, 'amount cannot be zero');
        betaToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
    }
    // Issue Tokens
    function issueTokens(uint percent) public {
        require(msg.sender == owner,"caller must be owner");

        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                alphaToken.transfer(recipient, (balance*percent)/100);
            }
        }        
    }

    // Unstake Tokens
    function unstakeTokens(uint _amount) public {
        require(_amount > 0, 'amount cannot be zero');
        uint balance  = stakingBalance[msg.sender];
        require(_amount <= balance, 'Amount cannot be greater than balance');
        betaToken.transfer(msg.sender, _amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] - _amount;
    }
}