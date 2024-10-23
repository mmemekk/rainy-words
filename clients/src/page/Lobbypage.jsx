import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lobbypage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Lobby = ()=>{

    const[users,setUsers] = useState(["mekk","joe","kong","zara","jj"]);


    useEffect(() => {

        socket.on("userList", (userNames)=>{
            setUsers(userNames);
        })

    })


    const[mode] = useState(["Beginner", "Intermediate", "Expert"])
    const keys = 0;
    const[modeDes] = useState(["100 words, 5 minutes", "200 words, 5 minutes", "300 words, 5 minutes"])

    // function goLeftClicked(){
    //     keys = (keys+1)%3;
    // }

    // function goRightClicked(){
    //     keys = (keys-1)%3;
    // }

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
                    <button className='goLeft' ><p className='goLeftButt'>&lt;</p></button>
                    <div className='modewin'><p className='Mode'>{mode[keys]}</p>
                    </div>
                    <button className='goRight'><p className='goRightButt'>&gt;</p></button>
                </div>
                <div className='ModeDes'>{modeDes[keys]}</div>
                <div className='playButton'> <button className='Play'><p className='Playtext'>Play</p></button></div>
            </div>
            <div><button className='Chatbox'>Chat</button></div>
        </div>
    );
}

export default Lobby;
