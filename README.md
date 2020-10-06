# Yield Farming

This is a blockchain project made on Ethereum which illustrates how yield farming is done in Defi.
Yield Farming is a type of liquidity mining where people liquidate their tokens into a defi application and earn rewards in the form of other tokens for staking.
In this project we assume an investor stakes BetaTokens into an application and gets rewarded by AlphaTokens during his time of staking.



## Structure of the Application

It's a Truffle project with a React frontend. Uses Ganache as local blockchain and MetaMask for browser Ethereum.


## WorkFlow of the Application

 1. An Investor is given 100 BetaTokens initially
 2. Investor then stakes some BetaTokens into the TokenFarm
 3. While the investor is still actively a staker of TokenFarm he gets rewarded with AlphaTokens
 4. The amount of AlphaTokens awarded is solely upto the TokenFarm, we assume all investors get 25% of their staking balance 
 5. Any Investor can unstake his tokens whenever he feels like

