import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const { socket, roomCode } = useContext(WebSocketContext);
  const [ players, setPlayers ] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // Fetch player list
    socket.emit("getPlayers", roomCode);

    // Update player list
    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, [roomCode, socket]);

  const startGame = () => {
    socket.emit("startGame", roomCode);
    nav("/game");
  };

  return (
    <div className="stack-elements">
      <div id="titleContainer">
        <div id="bigTitle">AI OH</div>
        <h1>Lobby</h1>
        <h1>Room Code: {roomCode}</h1>
      </div>
      <div id="center">
        <h2>Players:</h2>
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
