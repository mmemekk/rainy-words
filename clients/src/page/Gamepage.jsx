import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Gamepage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Game = ()=>{

    const [fallingWords, setFallingWords] = useState([]);

    useEffect(() => {

        socket.emit("startButton");
        console.log("emit");

        //emit only onces??
        socket.on("newWord", (word) => {
            setFallingWords((prevWords) => [
                ...prevWords,
                { text: word, id: Date.now() } // Use timestamp as a unique id
            ]);
        });

    }, []); 


    return (
        <div className="game-container">
            <h1>Rainy Word Game</h1>
            <div className="falling-words">
                {fallingWords.map((word) => (
                    <div key={word.id} className="falling-word">{word.text}</div>
                ))}
            </div>
        </div>
    );
 
}

export default Game;
