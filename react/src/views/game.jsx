import React from 'react';
import { WebSocketContext } from '../WebSocketContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Game() {

    //develop a player and judge view

    const { socket, roomCode } = React.useContext(WebSocketContext);
    const [ players, setPlayers ] = React.useState([]);
    const [ judge, setJudge ] = React.useState("");

    const nav = useNavigate();

    //



}

export default Game;


