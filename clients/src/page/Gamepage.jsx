import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Gamepage.css';
import { socket } from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Game = () => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(socket.id);
    const [fallingWords, setFallingWords] = useState([]);
    const [answer, setAnswer] = useState('');
    const [timer, setTimer] = useState({ minute: 5, second: 0 }); // State for timer (5 minutes)
    const [countDown, setcountDown] = useState();
    const [preGame, setpreGame] = useState(true);
    const [startMsg, setstartMsg] = useState(false);
    const [score, setScore] = useState([]);
    const [strokeColor, setStrokeColor] = useState('#ffffff'); 




    function generateRandomColor (){
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setStrokeColor(randomColor);
    };



    useEffect(() => {

        // If socket.id is not defined, navigate to home and return early
        if (!socket.id) {
            navigate('/');
            return;
        }

        if (socket.id !== userState) {
            setUserState(socket.id);
            navigate('/');
            return;
        }

        socket.on("returnHome", () => {
            navigate('/');
        })

        socket.emit("requestCountDown");

        socket.on("countDown", (time) => {
            generateRandomColor();
            setcountDown(time);
            const countDownAudio = new Audio("countdown.mp3");
            countDownAudio.volume = 0.3;
            countDownAudio.play();
        });

        socket.on("countDownEnd", () => {
            setstartMsg(true);
            const startAudio = new Audio("start.mp3");
            startAudio.volume = 0.3;
            startAudio.play();
            setTimeout(() => {
                setstartMsg(false);
                setpreGame(false);
                socket.emit("startButton");
            }, 1000);
        });



        socket.on("counter", (time) => {
            setTimer(time);
        });

        socket.on("userInfo", (userInfo) => {
            setScore(userInfo);
        })

        socket.on("newWord", (word, position) => {
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

        socket.on("updateScore", (userInfo) => {
            setScore(userInfo);
            console.log(userInfo);
        })

        socket.on("timesUp", () => {
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



    function handleInput(event) {
        let { value } = event.target;
        setAnswer(value);
    }

    function submitWord(event) {
        event.preventDefault();
        const wordExist = fallingWords.some(word => word.text === answer);
        if (wordExist) {
            socket.emit("submitWord", answer);

            setFallingWords((prevWords) => prevWords.filter((word) => word.text !== answer));
            const correctAudio = new Audio("/correct.mp3");
            correctAudio.play();

        } else {
            console.log("no word founded");
            const wrongAudio = new Audio("/wrong.mp3");
            wrongAudio.play();
        }

        setAnswer('');
    }




    return (
        <div className="game-container">

            {preGame && (
                <>
                    <div className="preGameScreen">
                        {!startMsg && (
                            <>
                                <div className="countdown-time" style={{WebkitTextStroke: `10px ${strokeColor}`}}>{countDown}</div>
                            </>
                        )}

                        {startMsg && (
                            <>
                                <div className="start-message">START!</div>
                            </>
                        )}
                    </div>
                </>

            )}

            <div className="topBar">
                <div className="scoreboard">
                    {score.map((user, index) => (
                        <div key={index} className={`player${index + 1}`}>
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
