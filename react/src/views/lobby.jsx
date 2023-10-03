import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const { socket, roomCode } = useContext(WebSocketContext);
  const [players, setPlayers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!socket || !roomCode) {
      console.log('Socket: ', socket)
      console.log('Room code: ' + roomCode)
      return;
    }
    console.log('Socket: ', socket)
    
    socket.emit("getPlayers", roomCode);

    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, [roomCode, socket]);

  // Start game on button click then nav to /game
  const startGame = () => {
    socket.emit("startGame", roomCode);
    nav("/game");
  };

  return (
    <div className="stack-elements">
      <div id="titleContainer">
        <div id="smallLogo"></div>
        <h1>Room Code: {roomCode}</h1>
      </div>
      <div id="center">
        <h2 style={{ textDecoration: "underline" }}>Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
        <button className="btn btn-light custom-button1" onClick={startGame}>
          Start Game
        </button>
      </div>
    </div>
  );
}

export default Lobby;
