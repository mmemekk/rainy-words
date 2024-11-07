import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lobbypage.css';
import { socket } from "../utils/socket.jsx";

const Lobby = () => {
    const navigate = useNavigate();
    const [userState, setUserState] = useState(socket.id);
    const [users, setUsers] = useState([]);
    const [keys, setKeys] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const mode = ["beginner", "intermediate", "expert"];
    const modeDes = ["Short Words", "medium-length words", "Long words"];
    const clickAudio = new Audio("click.mp3");

    const chatWindowRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 1000, y: 300 });
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {

        //system reset
        socket.on("returnHome", () => {
            navigate('/');
        });

        //handle if page is REFRESHED
        if (!socket.id) {
            navigate('/');
            return;
        }

        if (socket.id !== userState) {
            setUserState(socket.id);
            navigate('/');
        }

        //move to gamepage if game is Started
        socket.on("gameStart", () => {
            navigate('/game');
        });

        socket.emit("requestUserInfo");

        socket.on("userInfo", (userInfo) => {
            setUsers(userInfo.map(item => item.name));
        });

        socket.on("setKeys", (keys) => {
            setKeys(keys);
        });

        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("requestUserInfo");
            socket.off("userInfo");
            socket.off("receiveMessage");
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('sendMessage', input);
            setInput('');
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setMouseOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - mouseOffset.x,
                y: e.clientY - mouseOffset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    function handleChatButtonClick() {
        clickAudio.play();
        setIsChatOpen(true);
    }

    function handleCloseButtonClick() {
        clickAudio.play();
        setIsChatOpen(false);
    }

    function goLeftClicked() {
        clickAudio.play();
        setKeys((prevKeys) => {
            const newKeys = (prevKeys - 1 + mode.length) % mode.length;
            socket.emit("setKeys", newKeys);
            return newKeys;
        });
    }

    function goRightClicked() {
        clickAudio.play();
        setKeys((prevKeys) => {
            const newKeys = (prevKeys + 1) % mode.length;
            socket.emit("setKeys", newKeys);
            return newKeys;
        });
    }

    function handlePlayButtonClick() {
        clickAudio.play();
        socket.emit("gameMode", mode[keys]);
        navigate('/game');
    }

    function handleReturnButtonClick() {
        socket.emit("removeUser");
        navigate('/');
    }

    return (
        <div className="lobbybg">
            <div className="userListContainer">
                <p className='Player'>Players</p>
                <div className="userList">
                    {users.map((user, index) => (
                        <div key={index} className={`user${index + 1}`}>
                            {user}
                        </div>
                    ))}
                </div>
            </div>

            <button className='Return' onClick={handleReturnButtonClick}>Return</button>

            <div className='chooseModeWin'>
                <p className='ChooseMode'>Choose your mode</p>
                <div className='modeWinContent'>
                    <button className='goLeft' onClick={goLeftClicked}><p className='goLeftButt'>&lt;</p></button>
                    <div className='modewin'><p className='Mode'>{mode[keys]}</p></div>
                    <button className='goRight' onClick={goRightClicked}><p className='goRightButt'>&gt;</p></button>
                </div>
                <div className='ModeDes'>{modeDes[keys]}</div>
                <button className='Play' onClick={handlePlayButtonClick}><p className='Playtext'>Play</p></button>
            </div>

            <button className="Chatbox" onClick={handleChatButtonClick}>Chat</button>



            {isChatOpen && (
                <div
                    ref={chatWindowRef}
                    className="chat-overlay"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        position: 'absolute',
                        width: '300px',
                        height: '400px',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                >
                    <div
                        className="chat-header"
                        onMouseDown={handleMouseDown}
                        style={{
                            cursor: 'grab',
                        }}
                    >
                        <button className='close-chat' onClick={handleCloseButtonClick}>X</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((data, index) => (
                            <div key={index} className="chat-message">{data.sender}: {data.message}</div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '10px' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="Inputchat"
                        />
                        <button type="submit" className="SendButton">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Lobby;
