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
        socket.on('counter', (time) => {
            setTimer(time); // Update the timer state with the received time
        });
    }, []);

    const navigate = useNavigate();

    function retoprevious(){
        navigate('/lobby');
    }


    return (
        <div className="game-container">
            <button onClick={retoprevious}>RE</button>
            <div className="topBar">
                <p>Player1 Player2</p>
                <div className='clock'>Time</div>
                <p>Plater3 Player4</p>
            </div>
            <div className="falling-words">
                {fallingWords.map((word) => (
                    <div key={word.id} className="falling-word">{word.text}</div>
                ))}
            </div>
        </div>
    );

}

export default Game;
