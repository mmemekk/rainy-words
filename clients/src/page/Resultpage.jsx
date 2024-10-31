import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Resultpage.css';
import {socket} from "../utils/socket.jsx";

const Result = ()=>{
    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);
    const [userResult, setUserResult] = useState(socket.id);


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

        socket.emit("requestResult");

        // socket.on("gameResult", (result) =>{
        //     console.log("This is result:", result);
        //     // setUserResult(result.map(item => {item.name,item.score}));
        //     setUserResult(result.map(item => [item.name, item.score]));
        //     console.log("This is result:", userResult);
        // })

        return () => {
            socket.off("requestResult");
            socket.off("gameResult");

        };
    }, []);

    return (
        <div className='background'>
            <div className='Text-scoreboard'>
                <p className='textscore'>Score Board</p>
            </div>
            <div className="result-container">
                {/* <ul class="result-list">
                    {userResult.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul> */}
            </div>
        </div>
    );

}

export default Result;
