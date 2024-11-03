import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Resultpage.css';
import { socket } from "../utils/socket.jsx";

const Result = () => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(socket.id);
    const [userResult, setUserResult] = useState([]);


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

        socket.on("returnHome", () => {
            navigate('/');
        })

        socket.emit("requestResult");

        socket.on("gameResult", (result) =>{
            console.log("This is result:", result);
            setUserResult(result);
        })

        return () => {
            socket.off("requestResult");
            socket.off("gameResult");

        };
    }, []);

    function handleHomeButtonClick(){
        socket.emit("removeUser");
        navigate('/');
    }

    return (
        <div className='background'>

            <div className='Text-scoreboard'>
                Score Board
            </div>

            <div className="result-container">
                <div class="user-list">
                    {userResult.map((data, index) => (
                        <div key={index} className="user-row">
                            <div className="user">{data.name}</div>
                            <div className="score">{data.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button type="button" className='btnHome'onClick={handleHomeButtonClick}> back to home </button>
        </div>
    );

}

export default Result;
