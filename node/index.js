const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["*"],
  },
});

const redis = new Redis({
  host: "redis",
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

function generateRoomCode(length = 5) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Listen for room events for debugging
io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

let connectedUsers = 0;
io.on("connection", (socket) => {
  connectedUsers++;
  socket.userID = connectedUsers;
  socket.emit("yourID", socket.userID);

  io.emit("connectedClients", io.of("/").sockets.size);

  socket.on("createRoom", async () => {
    const roomCode = generateRoomCode();
    try {
      const reply = await redis.sadd("roomCodes", roomCode);
      if (reply === 1) {
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
      } else {
        console.warn("Room code already exists, regenerating...");
      }
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("joinRoom", async (roomCode) => {
    try {
      const exists = await redis.sismember("roomCodes", roomCode);
      if (exists) {
        socket.join(roomCode);
        socket.roomCode = roomCode; // Set the roomCode in the socket
        socket.emit("roomJoined", roomCode);
      } else {
        console.warn(`Room code ${roomCode} does not exist.`);
      }
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("setNickname", async (data) => {
    const { roomCode, nickname } = data;
    try {
      await redis.hset(roomCode, socket.id, nickname);
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("getPlayers", async (roomCode) => {
    try {
      const playerList = await redis.hvals(roomCode);
      io.to(roomCode).emit("updatePlayers", playerList); // Emit to all clients in the same room
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("disconnect", async () => {
    connectedUsers--;
    console.log("Client disconnected");

    try {
      const roomCode = socket.roomCode;
      await redis.hdel(roomCode, socket.id);
      const playerList = await redis.hvals(roomCode);

      io.to(roomCode).emit("updatePlayers", playerList);
    } catch (err) {
      console.error("Redis error", err);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
