import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Create from './views/create';
import Lobby from './views/lobby';
import { WebSocketProvider } from './WebSocketContext';

function App() {
  return (
    <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/lobby" element={<Lobby />} />
          </Routes>
        </Router>
    </WebSocketProvider>
  );
}

export default App;
