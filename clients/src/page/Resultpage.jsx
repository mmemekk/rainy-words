import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Resultpage.css';
import {socket} from "../utils/socket.jsx";
import Input from "../components/Input";
import Button from "../components/Button";

const Result = ()=>{
    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);


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

        socket.emit("requestResult");

        socket.on("gameResult", (result) =>{
            console.log("This is result:", result);
        })


        return () => {
            socket.off("requestResult");
            socket.off("gameResult");

        };
    }, []);



    


    return (
        <div className="result-container">



        </div>
    );
 
}

export default Result;

