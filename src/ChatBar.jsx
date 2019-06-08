import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKeyboard } from "@fortawesome/free-solid-svg-icons";

class ChatBar extends Component {
  render() {
    return (
      <div className="chatbar">
        <FontAwesomeIcon className="fa-user" icon={faUser} />
        <input
          className="chatbar-username"
          onKeyPress={this.props.usernameOnKeyPress}
          defaultValue={this.props.currentUser}
          placeholder="Your Name (Optional)"
        />

        <FontAwesomeIcon className="fa-keyboard" icon={faKeyboard} />
        <input
          className="chatbar-message"
          onKeyPress={this.props.messageOnKeyPress}
          placeholder="Type a message and hit ENTER"
        />
      </div>
    );
  }
}
export default ChatBar;
