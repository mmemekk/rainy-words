import { useEffect, useState } from 'react';
import '../styles/Adminpage.css';
import { socket } from "../utils/socket.jsx";


const Admin = () => {

    const [userState, setUserState] = useState(socket.id);
    const [users, setUsers] = useState([]);


    useEffect(() => {

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
        setUsers([]);
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
