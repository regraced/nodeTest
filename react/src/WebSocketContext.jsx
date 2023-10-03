import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const endpoint = "http://localhost:8000";
const WebSocketContext = createContext();

const generateUniqueID = () => {
  return Math.random().toString(36).substr(2, 9);
};

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [roomCode, setRoomCode] = useState(
    sessionStorage.getItem("roomCode") || ""
  );
  const [playerName, setPlayerName] = useState(
    sessionStorage.getItem("playerName") || ""
  );
  const socketRef = useRef();

  useEffect(() => {
    if (!localStorage.getItem("uniqueUser")) {
      localStorage.setItem("uniqueUser", generateUniqueID());
    }

    socketRef.current = io(endpoint, {
      query: {
        uniqueUser: localStorage.getItem("uniqueUser"),
      },
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
    });
    setSocket(socketRef.current);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("reconnectUser", localStorage.getItem("uniqueUser"));
    });

    socketRef.current.on("joinRoom", (code) => {
      setRoomCode(code);
      sessionStorage.setItem("roomCode", code);
    });

    socketRef.current.on("setNickname", (name) => {
      setPlayerName(name);
      sessionStorage.setItem("playerName", name);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startGame = (roomCode) => {
    if (socketRef.current) {
      socketRef.current.emit("startGame", roomCode);
    }
  };

  const rejoinRoom = (roomCode) => {
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", roomCode);
      setRoomCode(roomCode); // Update the roomCode state
      // Also update sessionStorage if needed
      sessionStorage.setItem('roomCode', roomCode);
    }
  };
  
  // Include rejoinRoom in the context value
  return (
    <WebSocketContext.Provider
      value={{ socket, roomCode, setRoomCode, playerName, setPlayerName, startGame, rejoinRoom }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export { WebSocketContext, WebSocketProvider };
