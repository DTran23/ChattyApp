import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import NavBar from './NavBar.jsx';
import MessageList from './MessageList.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: 'Anonymous', 
      messages: [],
      count: 0,
      color: "#2c3e50",
    }
  };

  componentDidMount() {
    const socket = new WebSocket("ws://localhost:3001/");

    socket.onopen = () => {
      console.log('Connected to server')
    }
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case "incomingMessage":
          console.log("I'm handling a message")
          const message = this.state.messages.concat(data)
          this.setState({currentUser: this.state.currentUser, messages: message})
        break;
        case "incomingNotification":
          const notification = this.state.messages.concat(data)
          this.setState({messages: notification})
        break;
        case "clientCount":
          this.setState({count: data.count});
        break;
        case "setColor":
          this.setState({color: data.color})
        break;
        case "imageLink":
          console.log("I'm handling an image link")
          console.log(data.content)
            this.setState({messages: data.content})
        break;
        default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
      }
    };  

    this.socket = socket;
  }
  
  render() {

    return (
      <div>
        < NavBar count={this.state.count} />
        < MessageList messages={this.state.messages} imgURL={this.state.imgURL} />
        < ChatBar currentUser={this.state.currentUser} usernameOnKeyPress={this.usernameKeyPressHandler} messageOnKeyPress={this.messageKeyPressHandler} />
      </div>
    );
  }




  messageKeyPressHandler = (event) => {
    if (event.key === 'Enter') {
      const messageJSON = JSON.stringify({id: "", type: "incomingMessage", username: this.state.currentUser, content: event.target.value, color: this.state.color})
      this.socket.send(messageJSON);
      event.target.value = "";
  }
}

  usernameKeyPressHandler = (event) => {

    if (event.key === 'Enter') {
      const notificationJSON = JSON.stringify({type: "incomingNotification", username: this.state.currentUser, content: `${this.state.currentUser} changed their name to ${event.target.value}`})
      this.socket.send(notificationJSON);
      this.setState({currentUser: event.target.value})
    }
  }

}
export default App;
