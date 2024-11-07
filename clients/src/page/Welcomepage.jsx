import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcomepage.css';
import { socket } from "../utils/socket.jsx";


const Welcome = () => {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const backgrounds = ['background1', 'background2', 'background3'];

    const [backgroundClass, setBackgroundClass] = useState('background1');
    useEffect(() => {
        const savedIndex = localStorage.getItem('backgroundIndex');
        if (savedIndex !== null) {
            setBackgroundClass(backgrounds[parseInt(savedIndex, 10)]);
        }
    }, []);


    useEffect(() => {
        //system reset
        socket.on("returnHome", () => {
            navigate('/');
        })

        socket.emit("requestUserInfo");
        socket.on("userInfo", (userInfo) => {
            const currentUser = userInfo.find(item => item.id === socket.id);
            if(currentUser){
                setUserName(currentUser.name);
            } else{ // handle if page is refreshed
                navigate('/');
            }
        });

        //move to gamepage if game is Started
        socket.on("gameStart", () => {
            navigate('/game');
        });


    }, []);

    setTimeout(() => {
        navigate('/lobby');
    }, 3000);


    // function handlePlayButtonClick() {
    //     const clickAudio = new Audio("/click.mp3");
    //     clickAudio.play();
    //     navigate('/lobby');
    // }




    return (
        <>
            <div className={`App ${backgroundClass}`}>
                <h className="welcomeText">Welcome</h>
                <h className="nameText">{userName}</h>
                {/* <button type ="button" className="btnPlay" onClick={handlePlayButtonClick}> play </button> */}
            </div>
        </>
    );

}

export default Welcome;
