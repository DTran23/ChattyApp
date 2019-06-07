import React, {Component} from 'react';
import Message from './Message.jsx';




class MessageList extends Component {
  render() {
    const messages = this.props.messages.map(message => {
      return (
        < Message key={message.id} message={message} setColor={this.props.color}/>
      );
    });

    return (
      <div className="messages">
        {messages}
      </div>
    );
  }
}

export default MessageList;
