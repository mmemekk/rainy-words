
const {io,httpServer} = require('./serverfunctions/socket.js');
const {addUser,removeUser,get_userInfo} = require('./serverfunctions/serverdata.js');
const {sendMessage} = require('./serverfunctions/chatmessage.js');
const {setDifficulties} = require('./serverfunctions/startgame.js');


io.on('connection', (socket) => {
    console.log("client connected");

    socket.on("addUser", (input) => {
        addUser(input,socket);
        console.log(socket.id);
        console.log(get_userInfo());
    });

    socket.on("sendMessage", (message) =>{
        sendMessage(message,socket);
    });

    socket.on("gameMode", (mode) =>{
        setDifficulties(mode);
    });

    socket.on("gameStart", () =>{

    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id,io);
        console.log(get_userInfo());
    });


});


httpServer.listen(3000,()=>{
  console.log('server running at http://localhost:3000');
});