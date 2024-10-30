import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';


import Home from "./page/Homepage.jsx"
import Welcome from "./page/Welcomepage.jsx"
import Lobby from "./page/Lobbypage.jsx"
import Game from "./page/Gamepage.jsx"
import Result from "./page/Resultpage.jsx"

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome/>} />
          <Route path="/lobby" element={<Lobby/>} />
          <Route path="/game" element={<Game/>} />
          <Route path="/result" element={<Result/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App
