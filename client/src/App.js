import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [connectedClients, setConnectedClients] = useState(0);
  const [userID, setuserID] = useState(null); 

  const socketRef = useRef();

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT); 
    socket.on('yourID', (ID) => {
      setuserID(ID);
    });

    socket.on("message", (data) => {
      setChat(oldChat => [...oldChat, data]);
    });

    socket.on("connectedClients", (count) => {
      setConnectedClients(count);
    });

    socketRef.current = socket;

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    socketRef.current.emit('message', message);  
    setMessage("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Real-time chat</p>
        <p>Connected users: {connectedClients}</p>
        <div>
          {chat.map((msg, index) => <div key={index}>{msg}</div>)}
        </div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </header>
    </div>
  );
}

export default App;


