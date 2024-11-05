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
    const [timer, setTimer] = useState({ minute: 5, second: 0 });
    const [countDown, setcountDown] = useState();
    const [preGame, setpreGame] = useState(true);
    const [startMsg, setstartMsg] = useState(false);
    const [score, setScore] = useState([]);
    const [strokeColor, setStrokeColor] = useState('#ffffff');
    const backgrounds = ['background1', 'background2', 'background3'];
    const [backgroundClass, setBackgroundClass] = useState('background1');
    const [scorePopups, setScorePopups] = useState([]);


    useEffect(() => {
        const savedIndex = localStorage.getItem('backgroundIndex');
        if (savedIndex !== null) {
            setBackgroundClass(backgrounds[parseInt(savedIndex, 10)]);
        }
    }, []);

    function generateRandomColor() {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setStrokeColor(randomColor);
    };

    function generateDarkColor() {
        const r = Math.floor(Math.random() * 150); // Limit red to 0 - 150
        const g = Math.floor(Math.random() * 150); // Limit green to 0 - 150
        const b = Math.floor(Math.random() * 150); // Limit blue to 0 - 150
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }


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
            countDownAudio.volume = 0.1;
            // countDownAudio.play();
        });

        socket.on("countDownEnd", () => {
            setstartMsg(true);
            const startAudio = new Audio("start.mp3");
            startAudio.volume = 0.1;
            // startAudio.play();
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
            const randomColor = generateDarkColor();

            const newWord = {
                id: Date.now(),
                text: word,
                position: randomPosition,
                color:randomColor
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





    function handleInput(event) {
        let { value } = event.target;
        setAnswer(value);
    }

    function submitWord(event) {
        event.preventDefault();
        const wordExist = fallingWords.find(word => word.text === answer);

        if (wordExist) {
            socket.emit("submitWord", answer);

            const newScorePopup = {
                id: Date.now(),
                score: wordExist.text.length,
                horizontalPosition: wordExist.position + (wordExist.text.length / 1.5), 
                verticalPosition: 15 + (12 * (Date.now() - wordExist.id) / 1000) //determine from transition time and (max,min) position
            };

            setScorePopups((prevPopups) => [...prevPopups, newScorePopup]);

            setFallingWords((prevWords) => prevWords.filter((word) => word.text !== answer));
            const correctAudio = new Audio("/correct.mp3");
            correctAudio.play();

            // Remove the score pop-up after a delay
            setTimeout(() => {
                setScorePopups((prevPopups) => prevPopups.filter((popup) => popup.id !== newScorePopup.id));
            }, 1000); // Duration of the pop-up

        } else {
            console.log("no word found");
            const wrongAudio = new Audio("/wrong.mp3");
            wrongAudio.play();
        }

        setAnswer('');
    }


    return (

        <div className={`App ${backgroundClass}`}>

            {preGame && (
                <>
                    <div className="preGameScreen">
                        {!startMsg && (
                            <>
                                <div className="countdown-time" style={{ WebkitTextStroke: `10px ${strokeColor}` }}>{countDown}</div>
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
                        style={{ left: `${word.position}%`,  color: `${word.color}` }}
                    >
                        {word.text}
                    </div>
                ))}

                {scorePopups.map((popup) => (
            
                    <div
                        key={popup.id}
                        className="score-popup"
                        style={{ left: `${popup.horizontalPosition}%`, top: `${popup.verticalPosition}%` }}
                    >
                        +{popup.score}
                    </div>

                ))}
            </div>



        </div>
    );

}

export default Game;
