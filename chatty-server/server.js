/* EXPRESS SERVER
| =================================================================================================== */
const express = require("express");
const WebSocket = require("ws");
const SocketServer = require("ws").Server;
const uuidv1 = require("uuid/v1");

const PORT = 3001;

const server = express()
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

/* WS SERVER
| =================================================================================================== */
const wss = new SocketServer({ server });

/* HELPER VARIABLES AND FUNCTIONS
| ========================================================== */
const colors = ["#5f27cd", "#ffbb01", "#ffbb01", "#0ccfba"];
const generateColor = () => {
  let randomColor = Math.floor(Math.random() * colors.length);
  return colors[randomColor];
};

const broadCastToClients = messageObj => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messageObj));
    }
  });
};

/* ON CONNECTION HANDLING
| ========================================================== */
wss.on("connection", ws => {
  const color = generateColor();
  let connectionCount = wss.clients.size;

  //assign client a color
  ws.send(
    JSON.stringify({
      color,
      type: "onConnect",
      currentUser: `Guest${connectionCount}`
    })
  );

  const message = {
    count: connectionCount,
    type: "clientCount",
    currentUser: `Guest${connectionCount}`,
    content: `Guest${connectionCount} has entered the room.`
  };

  broadCastToClients(message);

  /* ON MESSAGE HANDLING
| ========================================================== */
  ws.on("message", data => {
    const isImg = /https?:\/\/.*\.(?:png|jpg|gif)/i;
    const parsedMessage = JSON.parse(data);
    //add random Id
    parsedMessage.id = uuidv1();

    if (isImg.test(parsedMessage.content)) {
      //extract URL link and content
      const imgURL = parsedMessage.content.match(isImg).slice(0, 1);
      const message = parsedMessage.content.replace(isImg, "");
      const messageObj = { type: "incomingImageLink", imgURL, message };

      broadCastToClients(messageObj);
    } else {
      broadCastToClients(parsedMessage);
    }
  });

  /* ON CLOSEHANDLING
| ========================================================== */
  ws.on("close", () => {
    console.log("Client disconnected");
    const message = { count: wss.clients.size, type: "onClose" };
    broadCastToClients(message);
  });
});
