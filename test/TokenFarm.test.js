const TokenFarm = artifacts.require("TokenFarm");
const BetaToken = artifacts.require("BetaToken");
const AlphaToken = artifacts.require("AlphaToken");

require('chai')
.use(require('chai-as-promised'))
.should()

// Helper Function to convert Ether/Any_Token to Wei
function tokens(n) {
    return web3.utils.toWei(n,'Ether')    
}


contract('TokenFarm',([owner, investor]) => {
    let tokenFarm, betaToken, alphaToken;

    before(async() => {
        alphaToken = await AlphaToken.new()
        betaToken = await BetaToken.new()
        tokenFarm = await TokenFarm.new(betaToken.address, alphaToken.address)
    
        await alphaToken.transfer(tokenFarm.address,tokens('1000000'))
        await betaToken.transfer(investor,tokens('100'), { from: owner })
    })
        
    describe('BetaToken Deployment',async () => {
        it('has a name', async () => {
        const name = await betaToken.name()
        assert.equal(name, 'Beta Token', "Contract Name is InCorrect");
        })
    })

    describe('AlphaToken Deployment',async () => {
        it('has a name', async () => {
            const name = await alphaToken.name()
            assert.equal(name, 'Alpha Token', "Contract Name is InCorrect");
        })
    })

    describe('TokenFarm Deployment',async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Yield Farming', "Contract Name is InCorrect");
        })
        it('has a million AlphaTokens', async () => {
            let balance = await alphaToken.balanceOf(tokenFarm.address)
            assert.equal(balance, tokens('1000000'), "AlphaToken balance is InCorrect");
        })
    })

    describe('Yield Farming',async () => {
        it('Issues 25% of Betatokens as Alphatokens to all TokenFarm stakers', async () => {

            let result;
            //  **** Staking beta tokens **** 

            // Check investor beta balance before staking, should be 100
            result = await betaToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), "Investor Beta Balance Incorrect before staking");
            
            // Stake 100 beta into TokenFarm
            await betaToken.approve(tokenFarm.address,tokens('100'), { from: investor})
            await tokenFarm.stakeTokens(tokens('100'),{ from: investor})

            // Check investor beta balance, should be 0
            result = await betaToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), "Investor Beta Balance Incorrect after staking");
            
            // Check TokenFarm beta balance, should be 100
            result = await betaToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), "TokenFarm Beta Balance Incorrect after staking");

            // Check variable stakingBalance has what value which is basically how much investor has staked
            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), "Investor Staking Balance Incorrect after staking");

            // **** Issueing dapp tokens ****
            await tokenFarm.issueTokens('25', { from: owner})
             
            // Check investor dapp balance after issuance
            result = await alphaToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('25'), "Investor Alpha Balance Incorrect after issuance");

            // Ensure only owner can issue dapp tokens
            await tokenFarm.issueTokens('50',{ from: investor}).should.be.rejected

            // **** Checking status after unstaking ****
            await tokenFarm.unstakeTokens(tokens('25'),{ from: investor})
            
            result = await betaToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('25'), "Investor Beta Balance Incorrect after unstaking");

            result = await betaToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('75'), "TokenFarm Beta Balance Incorrect after unstaking");

            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('75'), "Investor Staking Balance Incorrect after unstaking");

            result = await alphaToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('999975'), "TokenFarm Alpha Balance Incorrect after unstaking");  
        })
    })
    
})