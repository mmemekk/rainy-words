const { io, httpServer } = require('./serverfunctions/socket.js');
const { addUser, removeUser, get_userInfo, get_nameFromId, get_count, get_result,resetData,printUserInfo} = require('./serverfunctions/serverdata.js');
const { sendMessage } = require('./serverfunctions/chatmessage.js');
const {setgameMode} = require('./serverfunctions/randomword.js')
const { trackTime, resetTimer,isGameRunning } = require('./serverfunctions/timer.js'); 
const {countDown} = require('./serverfunctions/countdown.js'); 
const { calculateScore } = require('./serverfunctions/scoring.js');
const { requestAccess } = require('./serverfunctions/admin.js');

io.on('connection', (socket) => {
    console.log("-----Client Connected-----");

    socket.on("addUser", (input) => {
        addUser(input, socket);
        console.log("-----NEW user added-----");
        printUserInfo();
    });

    socket.on("getUserName",(id) =>{
        socket.emit("userName",get_nameFromId(id));
    });

    socket.on("sendMessage", (message) => {
        sendMessage(message, socket);
    });

    socket.on("requestUserInfo",() =>{
        io.emit("userInfo",get_userInfo());
        // console.log("send user info");
    } )

    socket.on("gameMode", (mode) => {
        setgameMode(mode);
    });

    socket.on("setKeys", (keys) => {
        io.emit("setKeys",keys);
    })

    socket.on("requestCountDown", () => {
        countDown(socket);
        io.emit("gameStart");
        io.emit("userInfo",get_userInfo());

    });
    
    socket.on("startButton", () => {
        io.emit("userInfo",get_userInfo());
        trackTime(socket);
    });


    socket.on("submitWord" , (word) =>{
        console.log("Received Word:",word);
        calculateScore(socket.id,word);
    });

    socket.on("requestResult",() =>{
        io.emit("gameResult",get_result());
    });

    socket.on("resetSystem",()=>{
        resetData();
        if(isGameRunning()){
            resetTimer();
        }
        io.emit("returnHome");
        console.log("*****SYSTEM IS RESETED*****");
        printUserInfo();
    });

    socket.on("removeUser",()=>{
        removeUser(socket.id, io);
        io.emit("userInfo",get_userInfo());
        if(isGameRunning() && (get_count()===0)){ //if no user left while playing, stop reset the game
            resetTimer();
        }
        console.log("-----User is REMMOVED-----");
        printUserInfo();
    });

    socket.on('disconnect', () => {
        console.log('-----User Disconnected-----');
        removeUser(socket.id, io);
        printUserInfo();
        io.emit("userInfo",get_userInfo());

        if(isGameRunning() && (get_count()===0)){ //if no user left while playing, stop reset the game
            resetTimer();
        }
    });

    socket.on('adminRequestAccess', (inputUsername,inputPassword) => {
        console.log(inputUsername, inputPassword);
        if(requestAccess(inputUsername, inputPassword)){
            socket.emit('accessGranted');
        } else{
            socket.emit('accessDenied');
        }
    });
});

// httpServer.listen(3000, () => {
//     console.log('Server running at http://localhost:3000');
// });


httpServer.listen(3000,'172.20.10.2', () => {
    console.log("Server is running at  http://172.20.10.2:3000");
});

