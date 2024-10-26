import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Gamepage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Game = ()=>{

    const [fallingWords, setFallingWords] = useState([]);
    const [answer, setAnswer] = useState('');
    const [timer, setTimer] = useState({ minute: 5, second: 0 }); // State for timer (5 minutes)

    useEffect(() => {

        socket.emit("startButton");
        console.log("emit");


        socket.on("newWord", (word) => {
            console.log(word);
            const randomPosition = Math.floor(Math.random() * (90 - 10 + 1)) + 10; // Random left position (10-90%)
            setFallingWords((prevWords) => [
                ...prevWords,
                { text: word, position: randomPosition, id: Date.now() } // Use timestamp as a unique id
            ]);
        });

        socket.on('counter', (time) => {
            setTimer(time); // Update the timer state with the received time
        });

        return () => {
            socket.off("newWord");
            // socket.off('counter');
        };
    }, []);

s



    function submitWord(){
        socket.emit("submitWord", answer);
        setAnswer('');
    }
    function handleInput(event){
        let { value } = event.target;
        setAnswer(value);
      }


    return (
        <div className="game-container">
            <h1>Rainy Word Game</h1>
            <button onClick={retoprevious}>RE</button>
            <div className="topBar">
                <p>Player1 Player2</p>
                <div className='clock'>
                    Timer: {timer.minute}:{timer.second < 10 ? `0${timer.second}` : timer.second}
                </div>
                <p>Plater3 Player4</p>
            </div>

            <div className="inputContainer">
                <input className="inputBox" placeholder="Type Here" onChange={handleInput} value={answer}></input>
            </div>
            <button onClick={submitWord}>DONE</button>


            <div className="falling-words">
                {fallingWords.map((word) => (
                    <div key={word.id} className="falling-word" style={{ left: `${word.position}%` }}>{word.text}</div>
                ))}
            </div>


        </div>
    );

}

export default Game;
