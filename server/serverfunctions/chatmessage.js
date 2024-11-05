const {io} = require('./socket.js');
const {get_nameFromId} = require('./serverdata.js');

exports.sendMessage = function(msg,senderSocket){
    io.emit("receiveMessage", {sender:get_nameFromId(senderSocket.id),message:msg});
}