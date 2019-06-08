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
          <span
            className="message-content" 
            style={{color:this.props.message.color}}>
              <div className="message-content-container">{this.props.message.content}</div>
              <div className="message-content-img-notification">Attachment</div>
              <img className="message-content-img" src={this.props.message.imgURL} />
          </span>
        </div>
    );
    
    } else {
      return (
          <div className="message system">
            <p>{this.props.message.content}</p>
          </div>
      );
    }
  }
}

export default Message;
