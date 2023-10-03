import React, { useEffect } from "react";
import { WebSocketContext } from "../WebSocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import "../styles/styles.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const nav = useNavigate();
  const { socket, setRoomCode } = React.useContext(WebSocketContext);
  const [room, setRoom] = React.useState("");

  useEffect(() => {
    console.log('Socket connected')
    const handleRoomCreated = (code) => {
      console.log("Your room code:", code);
      setRoomCode(code);
      nav("/create");
    };

    const handleRoomJoined = (code) => {
      console.log("Your room code:", code);
      setRoomCode(code);
      nav("/create");
    };

    if (socket) {
      socket.on("roomCreated", handleRoomCreated);
      socket.on("roomJoined", handleRoomJoined);
    }

    return () => {
      if (socket) {
        socket.off("roomCreated", handleRoomCreated);
        socket.off("roomJoined", handleRoomJoined);
      }
    };
  }, [socket, nav, setRoomCode]);

  const createRoom = () => {
    if (socket) {
      socket.emit("createRoom");
    }
  };

  const joinRoom = () => {
    if (socket) {
      socket.emit("joinRoom", room);
    }
  };

  const handleChange = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div className="stack-elements">
      <div id="titleContainer">
        <div id="bigLogo"></div>
      </div>
      <div id="center" className="stacked-buttons">
        <Button variant="outline custom-button1" onClick={createRoom}>
          Create Room
        </Button>
        <Form.Control
          type="text"
          name="roomCodeInput"
          className="form-control input1"
          placeholder="Enter Room Code"
          maxLength="5"
          onChange={handleChange}
        />
        <Button variant="outline custom-button2" onClick={joinRoom}>
          Join Room
        </Button>
      </div>
    </div>
  );
}

export default Home;
