const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path'); 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {

        origin: 'http://localhost:5173' //allows connections from all clients

    }
});

// app.use(express.static(path.join(__dirname, '../../clients/dist'))); // Adjust the path based on your structure

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../clients/dist/index.html'));
// });

module.exports = {io, httpServer};