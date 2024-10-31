import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {socket} from "../utils/socket.jsx";


const Login = ()=>{
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

    

    return (
        <div className='loginbg'>

        </div>
    );

}

export default Login;
