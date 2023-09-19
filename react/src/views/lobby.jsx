import { useContext, useState, useEffect } from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";

function Lobby() {
  const { socket, roomCode } = useContext(WebSocketContext);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Frontend handling for updating player list
    socket.emit("getPlayers", roomCode);
    const handleUpdatePlayers = (playerList) => {
      setPlayers(playerList);
    };
    socket.on("updatePlayers", handleUpdatePlayers);
    return () => {
      socket.off("updatePlayers", handleUpdatePlayers);
    };
  }, [roomCode, socket]);

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
      </div>
    </div>
  );
}

export default Lobby;
