import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the Socket.IO server

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState(''); // Input for the chat message
    const [otherInput, setOtherInput] = useState(''); // Input for the second message

    useEffect(() => {
        // Listener for receiving chat messages
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Listener for receiving messages with the "receiveMessage" event
        socket.on('receiveMessage', (msg,sender) => {
            console.log('Received from server:', msg ,'from',sender);
        });

        return () => {
            // Clean up listeners on component unmount
            socket.off('chat message');
            socket.off('receiveMessage');
        };
    }, []);

    // Log other incoming messages
    socket.on("msg", (x) => {
        console.log(x);
    });

    // Function to send the chat message
    const sendMessage = (e) => {
        e.preventDefault();
        if (input) {
            socket.emit('addUser', input);
            setInput(''); // Clear the input field
        }
    };

    // Function to send the second type of message
    const sendOtherMessage = (e) => {
        e.preventDefault();
        if (otherInput) {
            socket.emit('sendMessage', otherInput);
            setOtherInput(''); // Clear the second input field
        }
    };

    return (
        <div>
            <h1>Socket.IO Chat</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>

            {/* Form for sending chat messages */}
            <form onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type username"
                />
                <button type="submit">addUser</button>
            </form>

            {/* Second input and button for another type of message */}
            <form onSubmit={sendOtherMessage}>
                <input
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    placeholder="Type message"
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}

export default App;
