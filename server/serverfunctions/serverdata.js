var userInfo = [];
var count = 0;

exports.addUser = function(input,socket){

    if (userInfo.some(user => user.name.toLowerCase() === input.toLowerCase())){ // check if username is already exist
        console.log('user already existed!');
        socket.emit("fail_addUser")

    } else{
        userInfo.push({name:input,score:0,id:socket.id});
        count++;
        socket.emit("success_addUser")
    }
}

exports.removeUser = function(socketId){
    userInfo.forEach((user,index) =>{
        if(user.id === socketId){
            userInfo.splice(index,1);
        }
    })
    count--;
    socket.emit("userRemoved",get_userInfo());
}


exports.get_userInfo = function(){
    return userInfo;
}

exports.getcount = function(){
    return count;
}
