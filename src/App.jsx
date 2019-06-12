import React, { Component } from "react";
import ChatBar from "./ChatBar.jsx";
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: "Guest",
      messages: [],
      setCount: 0,
      setColor: "#2c3e50",
      imgURL: ""
    };
  }

  componentDidMount() {

    /* SOCKET SERVER HANDLING
    | ========================================================================== */
    const socket = new WebSocket("ws://localhost:3001/");
    this.socket = socket;

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      const messages = this.state.messages.concat(data);

      switch (data.type) {
        case "incomingMessage":
          this.setState({
            currentUser: this.state.currentUser,
            messages
          });
          break;

        case "incomingNotification":
          this.setState({ messages });
          break;

        case "clientCount":
          this.setState({
            setCount: data.count,
            messages
          });
          break;
        case "onConnect":
          this.setState({
            currentUser: data.currentUser,
            setColor: data.color
          });
          break;
        case "onClose":
          this.setState({
            setCount: data.count
          });
          break;
        case "incomingImageLink":
          this.setState({ imgURL: data.imgURL, messages });
          break;
        default:
          throw new Error("Unknown event type " + data.type);
      }
    };
  }

  render() {
    return (
      <div>
        <NavBar count={this.state.setCount} />
        <MessageList
          messages={this.state.messages}
          imgURL={this.state.imgURL}
        />
        <ChatBar
          currentUser={this.state.currentUser}
          usernameOnKeyPress={this.usernameKeyPressHandler}
          messageOnKeyPress={this.messageKeyPressHandler}
        />
      </div>
    );
  }

  /* EVENT HANDLERS
    | ========================================================================== */

  messageKeyPressHandler = event => {
    const minChars = event.target.value;

    if (event.key === "Enter" && minChars.length > 0) {
      const messageJSON = JSON.stringify({
        id: "",
        type: "incomingMessage",
        username: this.state.currentUser,
        content: minChars,
        color: this.state.setColor
      });

      this.socket.send(messageJSON);
      event.target.value = "";
    }
  };
  
  usernameKeyPressHandler = event => {
    const minChars = event.target.value;
    if (event.key === "Enter" && minChars.length > 0) {
      const notificationJSON = JSON.stringify({
        type: "incomingNotification",
        username: this.state.currentUser,
        content: `${this.state.currentUser} changed their name to ${
          event.target.value
        }`
      });

      this.socket.send(notificationJSON);
      this.setState({ currentUser: event.target.value });
    }
  };
}
export default App;
