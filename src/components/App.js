import React, { Component } from 'react';
import Web3  from "web3";
import './App.css';
import  BetaToken from "../abis/BetaToken.json";
import  AlphaToken  from "../abis/AlphaToken.json";
import  TokenFarm from "../abis/TokenFarm.json";
import Navbar from './Navbar';
import Main from './Main';
class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } 
    else {
      window.alert('Non Ethereum browser detected. You should try considering Metamask!')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3;

    // Fetch accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    // Fetch NetworkID
    const networkId = await web3.eth.net.getId();
    
    // Load Betatoken Contract
    const betaTokenData = BetaToken.networks[networkId];
    if (betaTokenData) {
      const betaToken = new web3.eth.Contract(BetaToken.abi,betaTokenData.address);
      this.setState({ betaToken })
      let betaTokenBalance = await betaToken.methods.balanceOf(this.state.account).call() 
      this.setState({ betaTokenBalance: betaTokenBalance.toString() })
    } else {
      window.alert('BetaToken contract not deployed to detected network')      
    }

    // Load Alphatoken Contract
    const alphaTokenData = AlphaToken.networks[networkId];
    if (alphaTokenData) {
      const alphaToken = new web3.eth.Contract(AlphaToken.abi,alphaTokenData.address);
      this.setState({ alphaToken })
      let alphaTokenBalance = await alphaToken.methods.balanceOf(this.state.account).call() 
      this.setState({ alphaTokenBalance: alphaTokenBalance.toString() })
    } else {
      window.alert('AlphaToken Contract not deployed to detected network')      
    }

    // Load TokenFarm Contract
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi,tokenFarmData.address);
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call() 
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm Contract not deployed to detected network')      
    }

    //  Now we can Set Loading to false
    this.setState({ loading: false })
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.betaToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props){
    super(props)
    this.state = {
      account: '0x0',
      betaToken: {},
      alphaToken: {},
      tokenFarm: {},
      betaTokenBalance: '0',
      alphaTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }

  }
  render(){
    let content
    if (this.state.loading) {
      content = <h1 id="loading" className="text-center">Loading....</h1>
    } else {
      content = <Main
        betaTokenBalance={this.state.betaTokenBalance}
        alphaTokenBalance={this.state.alphaTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
      
    }


    return (
      <div className="App">
        <Navbar account={ this.state.account } />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
