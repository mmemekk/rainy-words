import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from "../utils/socket.jsx";


const Login = ({loginSuccess})=>{
    const navigate = useNavigate();
    const [userState, setUserState]=useState(socket.id);
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [error, setError] = useState('');

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

    function handleLogin(){
        if(username.trim() === "admin" && password === "1234"){
            loginSuccess();
        } else{
            setError("Invalid username or password");
        }
    }


    return (
        <div className='loginbg'>
            <div className='login-container'>
                <h2>Admin Login</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );

}

export default Login;
