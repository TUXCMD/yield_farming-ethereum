const TokenFarm = artifacts.require("TokenFarm");
const BetaToken = artifacts.require("BetaToken");
const AlphaToken = artifacts.require("AlphaToken");

module.exports = async function (deployer, network, accounts ) {

  
  await deployer.deploy(BetaToken);
  const betaToken = await BetaToken.deployed()
  
  await deployer.deploy(AlphaToken);
  const alphaToken = await AlphaToken.deployed()

  await deployer.deploy(TokenFarm, betaToken.address, alphaToken.address);
  const tokenFarm = await TokenFarm.deployed()
  
  await alphaToken.transfer(tokenFarm.address, '1000000000000000000000000')
  await betaToken.transfer(accounts[1],'100000000000000000000')
};
