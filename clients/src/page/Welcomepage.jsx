import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcomepage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";


const Welcome =() =>{

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');


    useEffect(() => {
        socket.emit("getUserName", socket.id);
        socket.on("userName", (name) => {
            if(name === null){ //try to NAVIGATE back on REFRESH
                navigate('/');
            } else{
                setUserName(name);
            }
        });

    }, []); 

    function handlePlayButtonClick(){
        navigate('/lobby');
    }



    return (
        <> 
        <div className="welcomebg">
         <h className="welcomeText">Welcome</h>
         <h className="nameText">{userName}</h>
         <Button className="btnPlay" placeHolder='play' onClick={handlePlayButtonClick}/>
         </div>
        </>
    );
                
}

export default Welcome;