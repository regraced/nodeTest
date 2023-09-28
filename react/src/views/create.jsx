import React from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Create() {
  const { socket, roomCode } = React.useContext(WebSocketContext);
  const [ nickname, setNickname ] = React.useState("");
  const nav = useNavigate();

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const joinLobby = () => {
    if (nickname) {
      socket.emit("setNickname", { roomCode, nickname });
      nav("/lobby");
    } else {
      alert("Please set a nickname!");
    }
  };

  return (
    <div className="stack-elements">
      <div id="titleContainer">
        <div id="bigTitle"></div>
        <h1></h1>
      </div>
        <input
          type="text"
          placeholder="Enter Nickname"
          onChange={handleChange}
        />
        <button className="btn btn-light custom-button1" onClick={joinLobby}>
          Start Game
        </button>
    </div>
  );
}

export default Create;
