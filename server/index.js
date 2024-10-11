const { io, httpServer } = require('./serverfunctions/socket.js');
const { addUser, removeUser, get_userInfo } = require('./serverfunctions/serverdata.js');
const { sendMessage } = require('./serverfunctions/chatmessage.js');
const { trackTime } = require('./serverfunctions/timer.js'); 

io.on('connection', (socket) => {
    console.log("Client connected");

    socket.on("addUser", (input) => {
        addUser(input, socket);
        console.log(socket.id);
        console.log(get_userInfo());
    });

    socket.on("sendMessage", (message) => {
        sendMessage(message, socket);
    });

    socket.on("gameMode", (mode) => {
        setDifficulties(mode);
    });

    socket.on("startButton", () => {
        trackTime(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        removeUser(socket.id, io);
        console.log(get_userInfo());
    });
});

httpServer.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

// httpServer.listen(3000,'172.20.10.2', () => {
//     console.log("Server is running at  http://172.20.10.2:3000");
// });


