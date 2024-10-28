const { io } = require('./socket.js');
const {updateScore,get_userInfo} = require('./serverdata.js');


exports.calculateScore = function(socketID,word){
    score = word.length;
    updateScore(socketID,score);
    io.emit("updateScore",get_userInfo());
}