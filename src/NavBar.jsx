import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from "@fortawesome/free-solid-svg-icons";

// import logo from './images/logo.png';

class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="navbar-content">
        {/* <img src={logo} />; */}
        <a href="/" className="navbar-brand">Chatty</a>
          <p>
            <FontAwesomeIcon className="fa-icon" icon={faUsers} />
            {`${this.props.count} Users Online`}
          </p>
        </div>
        
      </div>
    );
  }
}
export default NavBar;
