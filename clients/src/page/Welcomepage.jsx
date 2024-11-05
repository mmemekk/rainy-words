import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcomepage.css';
import { socket } from "../utils/socket.jsx";


const Welcome = () => {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const backgrounds = ['background1', 'background2', 'background3'];
    // Load the background index from localStorage on page load
    const [backgroundClass, setBackgroundClass] = useState('background1');

    useEffect(() => {
        const savedIndex = localStorage.getItem('backgroundIndex');
        if (savedIndex !== null) {
            setBackgroundClass(backgrounds[parseInt(savedIndex, 10)]);
        }
    }, []);


    useEffect(() => {
        socket.on("returnHome", () => {
            navigate('/');
        })

        socket.emit("getUserName", socket.id);
        socket.on("userName", (name) => {
            if (name === null) { //try to NAVIGATE back on REFRESH
                navigate('/');
            } else {
                setUserName(name);
            }
        });

        socket.emit("requestUserInfo");

        socket.on("userInfo", (userInfo) => {
            for (const user of userInfo) {
                if (user.id === socket.id) {
                    setUserName(user.name);
                    return;
                }
            }

            setUserName("USER NOT FOUNDED");

        })


    }, []);

    function handlePlayButtonClick() {
        const clickAudio = new Audio("/click.mp3");
        clickAudio.play();
        navigate('/lobby');
    }




    return (
        <>
            <div className={`App ${backgroundClass}`}>
                <h className="welcomeText">Welcome</h>
                <h className="nameText">{userName}</h>

                {/* <img src='../../public/avatar1.png' className='gallery-image' />
                    <img src='../../public/avatar2.png' className='gallery-image' />
                    <img src='../../public/avatar3.png' className='gallery-image' />
                    <img src='../../public/avatar4.png' className='gallery-image' />
                    <img src='../../public/avatar5.png' className='gallery-image' />
                    <img src='../../public/avatar6.png' className='gallery-image' />
                    <img src='../../public/avatar7.png' className='gallery-image' />
                    <img src='../../public/avatar8.png' className='gallery-image' /> */}


                <button type ="button" className="btnPlay" onClick={handlePlayButtonClick}> play </button>
            </div>
        </>
    );

}

export default Welcome;
