
// const {io,httpServer} = require('./serverfunctions/socket.js');
// const {addUser,removeUser,get_userInfo} = require('./serverfunctions/serverdata.js');
// const {sendMessage} = require('./serverfunctions/chatmessage.js');
// const {setDifficulties} = require('./serverfunctions/startgame.js');


// io.on('connection', (socket) => {
//     console.log("client connected");

//     socket.on("addUser", (input) => {
//         addUser(input,socket);
//         console.log(socket.id);
//         console.log(get_userInfo());
//     });

//     socket.on("sendMessage", (message) =>{
//         sendMessage(message,socket);
//     });

//     socket.on("gameMode", (mode) =>{
//         setDifficulties(mode);
//     });

//     socket.on("startButton", () => {
//       trackTime(socket); // Call trackTime when the start button is clicked
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         removeUser(socket.id,io);
//         console.log(get_userInfo());
//     });


// });


// httpServer.listen(3000,()=>{
//   console.log('server running at http://localhost:3000');
// });

const { io, httpServer } = require('./serverfunctions/socket.js');
const { addUser, removeUser, get_userInfo } = require('./serverfunctions/serverdata.js');
const { sendMessage } = require('./serverfunctions/chatmessage.js');
const { trackTime } = require('./serverfunctions/timer.js'); // Import trackTime function

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
        trackTime(socket); // Call trackTime when the start button is clicked
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
