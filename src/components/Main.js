import React, { Component } from 'react';
import bitcoin from "../bitcoin.png";
import ethereum from "../ethereum.png";
class Main extends Component {

  state = {
    button: 1
  };

  onSubmit = e => {
    e.preventDefault();
    let amount 
    amount = this.input.value.toString()
    amount = window.web3.utils.toWei(amount, 'Ether')
    
    if (this.state.button === 1) {
      this.props.stakeTokens(amount)
    }
    if (this.state.button === 2) {
      this.props.unstakeTokens(amount)
    }
  };

  render(){
    return (
        <div id="content" className="mt-2">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col"><h2>Staking Balance</h2></th>
              <th scope="col"><h2>Reward Balance</h2></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className='row'>
                    <div className='col float-right'>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} BETA
                        &nbsp;&nbsp;    <img src={ethereum} height='32' alt=""/> 
                    </div>
                </div>
              </td>
              <td>
                <div className='row'>
                    <div className='col float-right'>{window.web3.utils.fromWei(this.props.alphaTokenBalance, 'Ether')} ALPHA
                        &nbsp;&nbsp;    <img src={bitcoin} height='32' alt=""/> 
                    </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={ this.onSubmit }>
              <div>
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.betaTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={ethereum} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; BETA
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <button 
                    onClick={() => (this.state.button = 1)}
                    type="submit" className="btn btn-primary btn-block btn-lg">
                      STAKE!
                  </button>
                </div>
                <div className='col'>
                  <button
                    onClick={() => (this.state.button = 2)}
                    type="submit"
                    className="btn btn-warning btn-block btn-lg">
                      UN-STAKE...
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
      
    );
  }
}

export default Main;
