
exports.requestAccess= function(inputUsername,inputPassword){

    const username = "admin";
    const password = "1234";

    if(inputUsername === username && inputPassword === password){
        return true;
    } else{
        return false;
    }

}