
const {get_nameFromId} = require('./serverdata.js');

exports.sendMessage = function(message,senderSocket){
    senderSocket.broadcast.emit("receiveMessage", message, get_nameFromId(senderSocket.id));
}