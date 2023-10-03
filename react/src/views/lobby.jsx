import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const { socket, startGame, roomCode } = useContext(WebSocketContext);
  const [players, setPlayers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!socket || !roomCode) {
      return;
    }

    // Function to handle reconnection
    const handleReconnect = () => {
      socket.emit("getPlayers", roomCode);
    };

    // Emit getPlayers to get the initial list of players
    socket.emit("getPlayers", roomCode);

    // Listen for updates to the list of players
    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Listen for reconnection event to refresh list
    socket.on("reconnect", handleReconnect);

    // Cleanup
    return () => {
      socket.off("updatePlayers");
      socket.off("reconnect", handleReconnect);
    };
  }, [roomCode, socket]);

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
