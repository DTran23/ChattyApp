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
      count: 0,
      color: "#2c3e50",
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
      //Parse incoming data, add data to messages state array
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
            count: data.count, 
            messages 
          });
        break;
        //on connection assign username as guest and set each user a color
        case "onConnect":
          this.setState({ 
            currentUser: data.currentUser, 
            color: data.color 
          });
        break;
        //on close decrement count
        case "onClose":
          this.setState({
            count: data.count
          });
        break;
        //handle image url and content message
        case "imageLink":
          this.setState({ imgURL: data.imgURL, messages });
        break;
        //throw error if unknown case
        default:
        throw new Error("Unknown event type " + data.type);
      }
    };
  }

  render() {
    return (
      <div>
        <NavBar count={this.state.count} />
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
  
  //send data to server on "Enter"
  messageKeyPressHandler = event => {
    if (event.key === "Enter") {
      const messageJSON = JSON.stringify({
        id: "",
        type: "incomingMessage",
        username: this.state.currentUser,
        content: event.target.value,
        color: this.state.color
      });

      this.socket.send(messageJSON);
      event.target.value = "";
    }
  };
  //send data to display usernamer changes
  usernameKeyPressHandler = event => {
    if (event.key === "Enter") {
      const notificationJSON = JSON.stringify({
        type: "incomingNotification",
        username: this.state.currentUser,
        content: `${this.state.currentUser} changed their name to ${event.target.value}`
      });
      
      this.socket.send(notificationJSON);
      this.setState({ currentUser: event.target.value });
    }
  };
}
export default App;
