// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import { socket } from '../utils/socket';
import '../styles/chat.css';

const Chat = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  return (
    <div className="chat-overlay">
      <button className="close-chat" onClick={onClose}>X</button>
      <div className="chat-messages">
        {messages.map((data, index) => (
          <div key={index} className="chat-message">{data.mea}</div>
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
  );
};

export default Chat;
