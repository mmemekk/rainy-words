import { useEffect, useState } from 'react';
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
    const modeDes = ["100 words, 5 minutes", "200 words, 5 minutes", "300 words, 5 minutes"];
    const clickAudio = new Audio("click.mp3");

    useEffect(() => {

        if (!socket.id) {
            navigate('/');
            return;
        }

        if (socket.id !== userState) {
            setUserState(socket.id);
            navigate('/');
        }

        socket.on("returnHome", () => {
            navigate('/');
        })

        socket.emit("requestUserInfo");


        socket.on("userInfo", (userInfo) => {
            setUsers(userInfo.map(item => item.name));

        })

        socket.on("setKeys", (keys) => {
            setKeys(keys);
        })

        socket.on("gameStart", () => {
            navigate('/game');
        })

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

    function handleChatButtonClick(){
        clickAudio.play();
        setIsChatOpen(true);
    }

    function handleCloseButtionClick(){
        clickAudio.play();
        setIsChatOpen(false);
    }

    useEffect(() => {
        console.log(users);
    },[users]);
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



            <div>


                <button className='Return'>Return</button>
            </div>
            <div className='chooseModeWin'><p className='ChooseMode'> Choose your mode</p>
                <div className='modeWinContent'>
                    <button className='goLeft' onClick={goLeftClicked} >
                        <p className='goLeftButt'>&lt;</p>
                    </button>

                    <div className='modewin'>
                        <p className='Mode'>{mode[keys]}</p>
                    </div>

                    <button className='goRight' onClick={goRightClicked}>
                        <p className='goRightButt'>&gt;</p>
                    </button>

                </div>
                <div className='ModeDes'>{modeDes[keys]}</div>
                <div className='playButton'>
                    <button className='Play' onClick={handlePlayButtonClick}><p className='Playtext'>Play</p></button>
                </div>
            </div>

            <button className="Chatbox" onClick={handleChatButtonClick}>Chat</button>

            {isChatOpen && (
                <>
                    <div className="chat-overlay">
                        <button className="close-chat" onClick={handleCloseButtionClick}>X</button>
                        <div className="chat-messages">
                            {messages.map((data, index) => (
                                <div key={index} className="chat-message">{data.sender}: {data.message}</div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default Lobby;
