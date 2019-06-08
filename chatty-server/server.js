// server.js

const express = require("express");
const WebSocket = require("ws");
const SocketServer = require("ws").Server;
const uuidv1 = require("uuid/v1");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

  // Create the WebSockets server
const wss = new SocketServer({ server });

//Generate random color
const colors = ["#5f27cd", "#ee5253", "#10ac84", "#2e86de"]
const generateColor = () => {
  let randomColor = Math.floor(Math.random() * colors.length)
  return colors[randomColor]
}

wss.on("connection", ws => {
  const color = generateColor();
  let connectionCount = wss.clients.size;

  //on connection assign client a color
  ws.send(JSON.stringify({color, type: "onConnect", currentUser: `Guest${connectionCount}`}))
  
  //broadcast client count to all users
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({count: connectionCount, type: "clientCount", currentUser: `Guest${connectionCount}`, content: `Guest${connectionCount} has entered the room.`}))
    }
  })
  
  //handle message when recieve a message on the front end
  ws.on("message", data => {
    //check if image is a link
    const isImg = /https?:\/\/.*\.(?:png|jpg|gif)/i;
    const parsedMessage = JSON.parse(data);
    //add random Id
    parsedMessage.id = uuidv1();
    
    //if message contains an image link, broadcast message with type: "imageLink"
    if(isImg.test(parsedMessage.content)) {
      wss.clients.forEach(function each(client) {
        //extract URL link and content
        const imgURL = parsedMessage.content.match(isImg)[0]
        const message = parsedMessage.content.replace(isImg, "")

        if (client.readyState === WebSocket.OPEN) {
          parsedMessage.type = "imageLink";
          parsedMessage.imgURL = imgURL;
          parsedMessage.content = message;
          client.send(JSON.stringify({parsedMessage}))
        
        }
      })
    }
    //broadcast message
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
      });
  });
    
    
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
  console.log("Client disconnected")
  //broadcast decrement of client count
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({count: wss.clients.size, type: "onClose"}))
      }
    })
  });
});
