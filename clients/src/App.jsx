import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './App.css';

import Home from "./home.jsx"


function App() {


  // useEffect(() => {
  //   if (!socket) {
  //     socket = io("localhost:3000/"); 
  //   }
  //   return () => {
  //     if (socket) {
  //       socket.disconnect(); // Properly disconnect the socket on unmount
  //       socket = null; // Reset the socket variable
  //     }
  //   };
  // }, []); 


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
export 
{/* <div className="ContainerL"><InputName/><ButtonX/></div>; */}
