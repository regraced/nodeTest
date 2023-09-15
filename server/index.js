const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

let currentUsers = 0;

io.on('connection', (socket) => {
    currentUsers++;
    socket.userID = currentUsers;
    socket.emit('yourID', socket.userID);

    io.emit('connectedClients', io.of('/').sockets.size); 

    socket.on('message', (message) => {
        io.emit('message', `[User ${socket.userID}] ${message}`);
    });
    
    socket.on('disconnect', () => {
        currentUsers--;
        console.log('Client disconnected');
        io.emit('connectedClients', io.of('/').sockets.size);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
