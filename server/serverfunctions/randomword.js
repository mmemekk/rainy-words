const {selectMode} = require('./gamemode.js'); 
const {wordList} = require('./wordlist.js')

let usedWords = {
    3:[],
    4:[],
    5:[],
    6:[],
    7:[]
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
    setInterval(() => {
        const word = exports.getRandomWord();
        console.log(word);
    },2000);
}

exports.sendingWord();
