const { io } = require('./socket.js');
const {selectMode} = require('./gamemode.js'); 
const {wordList} = require('./wordlist.js');

let gameMode;

let usedWords = {
    3:[],
    4:[],
    5:[],
    6:[],
    7:[]
}

exports.setgameMode = function(mode){
    gameMode = mode;
}


exports.getWordLength = function(mode){
    let rnd = Math.random() * 100;
    let gameMode = selectMode(mode);
    let wordLength = gameMode(rnd);
    return wordLength;
}

// exports.getWordPosition = function(){
 
// }

exports.getRandomWord = function(){
    let wordLength = exports.getWordLength("hard");
    console.log("this wordlength", wordLength);
    let availableWord = wordList[wordLength].filter(word => !usedWords[wordLength].includes(word));  //array of available word

    if(availableWord.wordLength === 0){ // if all the words are used up
        usedWords[wordLength] = [];
        availableWord = wordlist[wordLength];
    }

    const rndIndex = Math.floor(Math.random() * availableWord.length);
    const rndWord = availableWord[rndIndex];

    usedWords[wordLength].push(rndWord);
    
    return rndWord;
}

exports.sendingWord = function(){
    console.log("sending word")
    const word = exports.getRandomWord();
    console.log(word);
    io.emit("newWord",word);
}


