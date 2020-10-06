import React, { Component } from 'react';
import yield_farming from "../yield_farming.png"
class Navbar extends Component {

  render(){
    return (
      <nav className="navbar navbar-dark bg-primary fixed-top">
        <a className="navbar-brand" href="#">
            <img src= {yield_farming} width="30" height="30" class="d-inline-block align-top" alt=""/>
            &nbsp; Yield Farming
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <div className="badge badge-primary text-wrap">Your address
              <small id="account">  { this.props.account}</small>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
