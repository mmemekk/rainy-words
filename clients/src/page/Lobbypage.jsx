import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lobbypage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Lobby = ()=>{

    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);
    const [users,setUsers] = useState([]);
    const [keys, setKeys] = useState(0);
    const mode = ["beginner", "intermediate", "expert"];
    const modeDes = ["100 words, 5 minutes", "200 words, 5 minutes", "300 words, 5 minutes"];

    useEffect(() => {

        if (!socket.id) {
            navigate('/');
            return;
        }

        if(socket.id!==userState){
            setUserState(socket.id);
            navigate('/');
        }

        socket.emit("requestUserInfo");

        socket.on("userInfo", (userInfo)=>{ 
            setUsers(userInfo.map(item => item.name));

        })

        socket.on("setKeys",(keys) =>{
            setKeys(keys);
        })

        socket.on("gameStart",()=>{
            navigate('/game');
        })

        
        return () => {
            socket.off("requestUserInfo");
            socket.off("userInfo");

        };

    },[]);


    function goLeftClicked(){
        setKeys((prevKeys) => {
            const newKeys = (prevKeys - 1 + mode.length) % mode.length;
            socket.emit("setKeys", newKeys); 
            return newKeys;
        });
    }
    
    function goRightClicked(){
        setKeys((prevKeys) => {
            const newKeys = (prevKeys + 1) % mode.length;
            socket.emit("setKeys", newKeys); 
            return newKeys;
        });
    }

    function handlePlayButtonClick(){
        socket.emit("gameMode", mode[keys]);
        navigate('/game');
    }



    return (
        <div className="lobbybg">
            <div className="userListContainer"><p className='Player'>Player</p>
                <div className="userList">
                    {users.map((user, index) => (
                        <div key={index} className="userItem">
                            {user}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <button className='Return'>Return</button>
            </div>
            <div className='chooseModeWin'><p className='ChooseMode'> Choose your mode</p>
                <div className='modeWinContent'>
                    <button className='goLeft' onClick={goLeftClicked} >
                        <p className='goLeftButt'>&lt;</p>
                    </button>

                    <div className='modewin'>
                        <p className='Mode'>{mode[keys]}</p>
                    </div>

                    <button className='goRight' onClick={goRightClicked}>
                        <p className='goRightButt'>&gt;</p>
                    </button>

                </div>
                <div className='ModeDes'>{modeDes[keys]}</div>
                <div className='playButton'> 
                    <button className='Play' onClick={handlePlayButtonClick}><p className='Playtext'>Play</p></button>
                </div>
            </div>
            <div><button className='Chatbox'>Chat</button></div>
        </div>
    );
}

export default Lobby;
