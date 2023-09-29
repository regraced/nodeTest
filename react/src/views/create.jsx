import React from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Create() {
  const { socket, roomCode } = React.useContext(WebSocketContext);
  const [nickname, setNickname] = React.useState("");
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
        <div id="bigLogo"></div>
      </div>
      <div id="center" className="stacked-buttons">
        <Form.Control
          type="text"
          className="form-control input1"
          placeholder="Enter Nickname"
          maxLength="10"
          onChange={handleChange}
        />
        <Button variant="btn btn-light custom-button1" onClick={joinLobby}>
          Start Game
        </Button>
      </div>
    </div>
  );
}

export default Create;
