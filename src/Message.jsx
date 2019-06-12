import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

class Message extends Component {
  render() {
    if (this.props.message.type === "incomingMessage") {
      return (
        <div className="message">
          <span
            className="message-username"
            style={{ backgroundColor: this.props.message.color }}
          >
            {this.props.message.username}
          </span>
          <span className="message-content">{this.props.message.content}</span>
        </div>
      );
    } else if (this.props.message.type === "incomingImageLink") {
      return (
        <div className="message">
          <span
            className="message-username"
            style={{ backgroundColor: this.props.message.color }}
          >
            {this.props.message.username}
          </span>
          <span className="message-content">
            <div className="message-content-container">
              {this.props.message.content}
            </div>
            <div className="message-content-img-notification">Attachment</div>
            <img
              className="message-content-img"
              src={this.props.message.imgURL}
            />
          </span>
        </div>
      );
    } else {
      return (
        <div className="message-system-container">
          <div className="message system">
            <div className="message-system-flag">
              <FontAwesomeIcon className="fa-flag" icon={faFlag} />
            </div>
            <p>{this.props.message.content}</p>
          </div>
        </div>
      );
    }
  }
}

export default Message;
