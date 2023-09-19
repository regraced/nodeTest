import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const endpoint = "http://localhost:8000";
const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [roomCode, setRoomCode] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(endpoint);
    setSocket(socketRef.current);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, roomCode, setRoomCode }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
