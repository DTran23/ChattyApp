import React, {Component} from 'react';
class Message extends Component {
  render() {
    if(this.props.message.type === "incomingMessage"){
      return (
          <div className="message">
            <span className="message-username" style={{color: this.props.message.color}}>{this.props.message.username}</span>
            <span className="message-content" style={{color:this.props.message.color}}>{this.props.message.content}</span>
          </div>
      );
    } else if (this.props.message.type === "imageLink") {
      return (
        <div className="message">
          <span className="message-username" style={{color: this.props.message.color}}>{this.props.message.username}</span>
          <img className="message-content-img" src={this.props.message.content} />
        </div>
    );
    
    } else {
      return (
          <div className="message system">{this.props.message.content}</div>
      );
    }
  }
}

export default Message;
