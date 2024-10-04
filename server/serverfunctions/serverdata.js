var username = [];
var count = 0;

exports.addUser = function(input){
    username.push({name:input,score:0});
    count++;
    console.log(username);
    console.log(count);
}

exports.username = username;