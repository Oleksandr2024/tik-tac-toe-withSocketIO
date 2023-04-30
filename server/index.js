const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = process.env.SERVER_PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// initialize the list of options
let players = ["", "x", "o"];

io.on("connection", (socket) => {
  console.log(`User with id: ${socket.id} connected`);
  // send the initial list of options to the client
  socket.emit("playerOptions", players);

  // handle the selectedOption event
  socket.on("selectedOption", (data) => {
    console.log(
      "socket.id: " + socket.id + " chose " + data.option + " id: " + data.id
    );

    io.emit("selectedOption", data); // ????

    // update the list of options for all clients
    io.emit("playerOptions", players);
  });

  socket.on("playerMoved", (data) => {
    io.emit("playerMoved", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server is running");
});
