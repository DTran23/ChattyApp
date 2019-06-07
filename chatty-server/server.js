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

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

const colors = ["#3498db", "#c0392b", "#d35400", "#9b59b6"]
const generateColor = () => {
  let randomColor = Math.floor(Math.random() * colors.length)
  return colors[randomColor]
}

wss.on("connection", ws => {
  const color = generateColor();
  let connectionCount = wss.clients.size;
  ws.send(JSON.stringify({color, type: "setColor"}))
  
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({count: connectionCount, type: "clientCount"}))
    }
  })
  
  ws.on("message", data => {
    const isImg = /https?:\/\/.*\.(?:png|jpg|gif)/i;
    const parsedMessage = JSON.parse(data);
    parsedMessage.id = uuidv1();

    if(isImg.test(parsedMessage.content)) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          parsedMessage.imgURL = data.content;
          parsedMessage.type = "imageLink";
          client.send(JSON.stringify({parsedMessage}))
        }
      })
    }
      
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
      });
    });
    
    
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
  console.log("Client disconnected")
  connectionCount = connectionCount - 1;
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({count: connectionCount, type: "clientCount"}))
      }
    })

  }
    


  );
});
