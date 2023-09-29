import React from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Game() {
  const { socket, roomCode } = React.useContext(WebSocketContext);
  const [ players, setPlayers ] = React.useState([]);
  const [ judge, setJudge ] = React.useState("");

  // Create a judge view and join judge channel in socket.io
  React.useEffect(() => {
    console.log("Socket:", socket); // Check if socket is defined and connected
    console.log("Room code:", roomCode); // Check if roomCode is as expected

    socket.emit("joinJudge", roomCode);
    socket.on("judge", (judge) => {
      setJudge(judge);
      console.log("The judge is ", judge);
    });
    return () => {
      socket.off("judge");
    };
  }, [roomCode, socket]);


  return (
    <div>
      {socket.id === judge ? (
        <div>You are the judge</div>
      ) : (
        <div>You are a player</div>
      )}
    </div>
  );
}  

export default Game;
