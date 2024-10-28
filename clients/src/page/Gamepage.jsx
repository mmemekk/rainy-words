import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Gamepage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Game = ()=>{
    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);
    const [fallingWords, setFallingWords] = useState([]);
    const [answer, setAnswer] = useState('');
    const [timer, setTimer] = useState({ minute: 5, second: 0 }); // State for timer (5 minutes)
    const [score,setScore] = useState([]);

    useEffect(() => {


        if(socket.id!==userState){
            setUserState(socket.id);
            navigate('/');
            return;
        }

        socket.emit("startButton");



        socket.on("newWord", (word,position) => {
            console.log(word);
            const randomPosition = position;

            const newWord = {
                text: word,
                position: randomPosition,
                id: Date.now(),
            };

            setFallingWords((prevWords) => [...prevWords, newWord]);

            setTimeout(() => {
                setFallingWords((prevWords) =>
                    prevWords.filter((w) => w.text !== newWord.text) // Remove the word after the timer
                );
                // console.log("removeFallingword:");
            }, 10000); 

        });

        socket.on("counter", (time) => {
            setTimer(time); // Update the timer state with the received time
        });

        socket.on("userInfo", (userInfo) =>{
            setScore(userInfo);
        })

        socket.on("updateScore", (userInfo) =>{
            setScore(userInfo);
            console.log(userInfo);
        })

        return () => {
            socket.off("startButton");
            socket.off("newWord");
            socket.off('counter');
            socket.off("userInfo");
            socket.off("updateScore");

        };
    }, []);


    // useEffect(() => {
    //     console.log("Updated fallingWords array:", fallingWords);
    // }, [fallingWords]);


    function retoprevious(){
        navigate('/');
    }


    function handleInput(event){
        let { value } = event.target;
        setAnswer(value);
    }

    function submitWord(event){
        event.preventDefault();
        const wordExist = fallingWords.some(word => word.text === answer);
        if(wordExist){
            socket.emit("submitWord",answer);

            setFallingWords((prevWords) => prevWords.filter((word) => word.text !== answer));

        } else{
            console.log("no word founded");
        }
        setAnswer('');

    }

    


    return (
        <div className="game-container">
            <button onClick={retoprevious}>RE</button>
            <div className="topBar">
                <div className="scoreboard">
                    {score.map((player, index) => (
                        <p key={index}>
                            {player.name}: {player.score}
                        </p>
                    ))}
                </div>
                <div className='clock'>
                    Timer: {timer.minute}:{timer.second < 10 ? `0${timer.second}` : timer.second}
                </div>
                <p>Plater3 Player4</p>
            </div>

            <form onSubmit={submitWord} className="inputContainer">
                <input className="inputBox" placeholder="Type Here" onChange={handleInput} value={answer}></input>
                <button onClick={submitWord}>DONE</button>
            </form>



            <div className="falling-words">
                {fallingWords.map((word) => (
                    <div 
                        key={word.id} 
                        className={"falling-word"} 
                        style={{ left: `${word.position}%` }}
                    >
                        {word.text}
                    </div>
                ))}
            </div>


        </div>
    );
 
}

export default Game;

