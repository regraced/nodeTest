import React, { createContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const startGame = (roomCode) => {
    if (socketRef.current) {
      socketRef.current.emit("startGame", roomCode);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, roomCode, setRoomCode, startGame }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
