import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './screens/Login/Login';
import Dashboard from './screens/Dashboard/Dashboard';
import AgentScreen from './screens/AgentScreen/AgentScreen';
import Register from './screens/Register/Register';
import FacebookConnection from './screens/FacebookConnection/FacebookConnection';
import Confirmation from './screens/Confirmation/Confirmation';
import Main from 'screens/Main/Main';
import io from 'socket.io-client';
import HomeScreen from 'screens/HomeScreen/HomeScreen';

const App = () => {
  // useEffect(()=> {
  //   if(!localStorage.getItem("token")) {
  //     window.location.href = 'https://3313-2401-4900-1c67-1844-1472-6f1-71af-21b3.ngrok-free.app/login';
  //   }
  // },[localStorage])
  const socket = io('https://fb-helpdesk-richpanel.onrender.com');
  // , {
  //   // withCredentials: true
  // }); 
  return (

      <Router>
      <div>
        <Routes>
        <Route  path="/" element={<Login/>} />
          <Route  path="/home" element={<HomeScreen/>} />
          <Route  path="/agent" element={<AgentScreen/>} />
          <Route  path="/main/*" element={<Main socket={socket}/>} />
          <Route  path="/login" element={<Login/>} />
          <Route  path="/register" element={<Register/>} />
          <Route  path="/connect-facebook" element={<FacebookConnection/>} />
          <Route  path="/confirmation" element={<Confirmation/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
