const { io } = require("./socket");

var userInfo = [];
var count = 0;

exports.addUser = function(input,socket){

    if(count ===6){
        socket.emit("userFull");
        return;
    }

    if (userInfo.some(user => user.name.toLowerCase() === input.toLowerCase())){ // check if username is already exist
        console.log('user already existed!');
        socket.emit("fail_addUser")

    } else if(userInfo.some(user=> user.id === socket.id)){
        console.log('duplicated ID!');
        socket.emit("fail_addUser");
    } else{
        userInfo.push({name:input,score:0,id:socket.id});
        count++;
        socket.emit("success_addUser")
    }
}

exports.updateScore = function(socketID,score){
    const user = userInfo.find((user) => user.id === socketID);

    if(user){
        user.score+=score;
    } else{
        console.log(`user with ID ${socketID} not found`);
    }

}

exports.removeUser = function(socketId,io){

    if(count!==0){
        userInfo.forEach((user,index) =>{
            if(user.id === socketId){
                userInfo.splice(index,1);
            }
        })
        count--;
    }
    io.emit("userRemoved",exports.get_userInfo()); //must check if info correct
}

exports.resetData = function(){
    userInfo=[];
    count=0;
}

exports.get_nameFromId = function(socketId){
    for(const user of userInfo){
        if(user.id === socketId){
            return user.name;
        }
    }
    return null;
}

exports.get_result = function(){
    return [...userInfo].sort((a, b) => b.score - a.score); //send in descending order
}

exports.get_userInfo = function(){
    return userInfo;
}

exports.get_count = function(){
    return count;
}

exports.printUserInfo = function(){
    console.log("User Info:", exports.get_userInfo());
}