import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Adminpage.css';
import { socket } from "../utils/socket.jsx";


const Admin = () => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(socket.id);
    const [users, setUsers] = useState([]);
    const [isAuthenticated,setIsAuthenticated] = useState(false);


    useEffect(() => {

        // if (!socket.id) {
        //     navigate('/admin');
        //     return;
        // }

        // if (socket.id !== userState) {
        //     setUserState(socket.id);
        //     navigate('/admin');
        //     return;
        // }

        socket.emit("requestUserInfo");

        socket.on("userInfo", (userInfo) => {
            console.log(userInfo);
            setUsers(userInfo);

        })

        return () => {
        };
    }, []);

    function resetGame() {
        socket.emit("resetSystem");
    }


    return (
        <div className='adminbg'>
            <button onClick={resetGame} className="BtnReset">RESET GAME</button>

            <ol className="ActiveUser">
                {users.map((user, index) => (
                    <li key={index}>
                        name: {user.name} score: {user.score} id: {user.id}
                    </li>
                ))}
            </ol>



        </div>
    );

}

export default Admin;
