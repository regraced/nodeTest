import React from 'react';
import { WebSocketContext } from '../WebSocketContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import '../styles/styles.css';
import '../assets/bgMove'
import { useNavigate } from 'react-router-dom';

function Home() {
    const nav = useNavigate();
    const { socket, setRoomCode } = React.useContext(WebSocketContext);
    const [room, setRoom] = React.useState('');

    const createRoom = () => {
        socket.emit('createRoom');
        socket.on('roomCreated', (code) => {
            console.log("Your room code:", code);
            setRoomCode(code);
            nav('/create')
        });
    }
    
    const joinRoom = () => {
        socket.emit('joinRoom', room);
        socket.on('roomJoined', (code) => {
            console.log("Your room code:", code);
            setRoomCode(code);
            nav('/create')
        });
    }

    const handleChange = (e) => {
        setRoom(e.target.value);
    }

    return (
        <div className='stack-elements'>
            <div id="titleContainer">
                <div id="bigTitle">AI OH</div>
                <h1>An AI Card Game for Small Businesses</h1>
            </div>
            <div id="center" className="stacked-buttons">
                <Button className='btn btn-light custom-button1' onClick={createRoom}>Create Room</Button>
                <Form.Control type="text" name="roomCodeInput" className="form-control input1" placeholder="Enter Room Code" maxLength="5" onChange={handleChange} />
                <Button className="btn btn-light custom-button1" onClick={joinRoom}>Join Room</Button>
            </div>
        </div>
    )
}

export default Home;
