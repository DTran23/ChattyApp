import React, {Component} from 'react';

class ChatBar extends Component {



  render() {
    return (
      <div className="chatbar">
        <input className="chatbar-username" onKeyPress={this.props.usernameOnKeyPress} defaultValue={this.props.currentUser} placeholder="Your Name (Optional)" />
        <input className="chatbar-message" onKeyPress={this.props.messageOnKeyPress} placeholder="Type a message and hit ENTER" />
      </div>
    );
  }
}
export default ChatBar;
