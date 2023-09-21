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

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("connectedClients", io.of("/").sockets.size);

  socket.on("createRoom", async () => {
    const roomCode = generateRoomCode();
    try {
      const reply = await redis.sadd("active_rooms", roomCode);
      if (reply === 1) {
        await redis.hset(
          `room:${roomCode}:scores`,
          "aiScore",
          0,
          "humanScore",
          0
        );
        socket.roomCode = roomCode;
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
      } else {
        console.warn("Room code already exists, try again.");
      }
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("setNickname", async (data) => {
    const { roomCode, nickname } = data;
    const playerUUID = socket.id;
    try {
      await redis.hset(
        `player:${playerUUID}`,
        "roomCode",
        roomCode,
        "playerName",
        nickname,
        "playerScore",
        0
      );
      console.log(`Player ${nickname} joined room ${roomCode}`);

      await redis.sadd(`room:${roomCode}:players`, playerUUID);
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("getPlayers", async (roomCode) => {
    try {
      const playerUUIDs = await redis.smembers(`room:${roomCode}:players`);
      let playerList = [];

      for (const uuid of playerUUIDs) {
        const playerName = await redis.hget(`player:${uuid}`, "playerName");
        console.log(`Retrieved nickname for ${uuid}:`, playerName);
        playerList.push(playerName);
      }

      io.to(roomCode).emit("updatePlayers", playerList);
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("startGame", async (roomCode) => {
    try {
      const playerUUIDs = await redis.smembers(`room:${roomCode}:players`);
      for (const uuid of playerUUIDs) {
        const playerName = await redis.hget(`player:${uuid}`, "playerName");
        console.log(`Retrieved nickname for ${uuid}:`, playerName);
        playerList.push(playerName);
      }

      io.to(roomCode).emit("updatePlayers", playerList);
    } catch (err) {
      console.error("Redis error", err);
    }
  });

  socket.on("disconnect", async () => {
    const playerUUID = socket.id;
    try {
      const roomCode = await redis.hget(`player:${playerUUID}`, "roomCode");
      if (roomCode) {
        await redis.srem(`room:${roomCode}:players`, playerUUID);

        const remainingPlayersCount = await redis.scard(
          `room:${roomCode}:players`
        );

        if (remainingPlayersCount === 0) {
          const aiScore = await redis.hget(
            `room:${roomCode}:scores`,
            "aiScore"
          );
          const humanScore = await redis.hget(
            `room:${roomCode}:scores`,
            "humanScore"
          );

          await redis.del(`room:${roomCode}:scores`);
          await redis.del(`room:${roomCode}:players`);
          await redis.srem("active_rooms", roomCode);
        }
      }
      await redis.del(`player:${playerUUID}`);
    } catch (err) {
      console.error("Redis error", err);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
