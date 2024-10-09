
const {io,httpServer} = require('./serverfunctions/socket.js');
const {addUser,get_userInfo,removeUser} = require('./serverfunctions/serverdata.js');





io.on('connection', (socket) => {
    console.log("client connected");



    socket.on("addUser", (input) => {
        addUser(input,socket);
        console.log(socket.id);
        console.log(get_userInfo());
    })

    socket.on("sentMessage", (message) =>{
        socket.broadcast.emit("receiveMessage", message)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id,io);
        console.log(get_userInfo());
      });


});


httpServer.listen(3000,()=>{
  console.log('server running at http://localhost:3000');
});