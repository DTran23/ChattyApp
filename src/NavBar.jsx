import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faComments } from "@fortawesome/free-solid-svg-icons";

class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <FontAwesomeIcon className="fa-brand" icon={faComments} />
            Chatty
          </a>
          <p>
            <FontAwesomeIcon className="fa-users" icon={faUsers} />
            {`${this.props.count} Users Online`}
          </p>
        </div>
      </div>
    );
  }
}
export default NavBar;
