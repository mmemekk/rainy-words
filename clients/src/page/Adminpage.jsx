import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Adminpage.css';
import {socket} from "../utils/socket.jsx";


const Admin = ()=>{
    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);


    useEffect(() => {

        if (!socket.id) {
            navigate('/admin');
            return;
        }

        if(socket.id!==userState){
            setUserState(socket.id);
            navigate('/admin');
            return;
        }


        return () => {
            

        };
    }, []);

    function resetGame(){
        socket.emit("resetSystem");
    }


    return (
        <div className='adminbg'>
            <button onClick={resetGame}>RESET GAME</button>
        </div>
    );

}

export default Admin;
