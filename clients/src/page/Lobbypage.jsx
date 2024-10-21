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

    return (
        <div className="lobbybg">
            <div className="userListContainer">
                <div className="userList">
                    {users.map((user, index) => (
                        <div key={index} className="userItem">
                            {user}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='levelContainer'>
                
            </div>







        </div>

    );
}

export default Lobby;