
exports.easyMode = function(rnd){
    if (rnd < 40) return 3;
    else if (rnd < 70) return 4;
    else if (rnd < 90) return 5;
    else if (rnd < 97) return 6;
    else return 7;
}

exports.mediumMode = function(rnd){
    if (rnd < 20) return 3;
    else if (rnd < 45) return 4;
    else if (rnd < 75) return 5;
    else if (rnd < 90) return 6;
    else return 7;
}

exports.hardMode = function(rnd){
    if (rnd < 5) return 3;
    else if (rnd < 15) return 4;
    else if (rnd < 35) return 5;
    else if (rnd < 65) return 6;
    else return 7;
}

exports.selectMode = function(mode){
    if(mode === "beginner"){
        console.log("Beginner mode is selected");
        return exports.easyMode;
    } else if (mode === "intermediate"){
        console.log("Intermediate mode is selected");
        return exports.mediumMode;
    } else{
        console.log("Expert mode is selected");
        return exports.hardMode;
    }
}
