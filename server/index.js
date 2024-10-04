
const {io,httpServer} = require('./serverfunctions/socket.js');
const {addUser,username} = require('./serverfunctions/serverdata.js');
io.on('connection', (socket) => {
    console.log("client connected");

    socket.on("addUser", (input) => {
        addUser(input);
        console.log(username);
    })


});


httpServer.listen(3000,()=>{
  console.log('server running at http://localhost:3000');
});