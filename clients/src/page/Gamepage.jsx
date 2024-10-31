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

        // If socket.id is not defined, navigate to home and return early
        if (!socket.id) {
            navigate('/');
            return;
        }

        if(socket.id!==userState){
            setUserState(socket.id);
            navigate('/');
            return;
        }

        socket.on("returnHome", () =>{
            navigate('/');
          })

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
            }, 5000);

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

        socket.on("timesUp",() =>{
            navigate('/result');
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
            <div className="topBar">
                <div className="scoreboard">
                    {score.map((user, index) => (
                        <div key={index} className={`player${index+1}`}>
                            {user.name}:{user.score}
                        </div>
                    ))}
                </div>

                
                <div className='clock'>
                    {timer.minute}:{timer.second < 10 ? `0${timer.second}` : timer.second}
                </div>
            </div>

            <form onSubmit={submitWord} className="inputContainer">
                <input className="inputBox" placeholder="Type Here ..." onChange={handleInput} value={answer}></input>
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
