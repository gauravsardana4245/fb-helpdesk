import Navbar from 'components/Navbar/Navbar';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from 'screens/Dashboard/Dashboard';
import { jwtDecode } from "jwt-decode";

const HomeScreen = () => {
    const [user, setUser] = useState({name: "user"});
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=> {
        if(!localStorage.getItem("token")) {
          navigate('/login');
        }
        // else {
        //     const decoded = jwtDecode(localStorage.getItem("token"));
        //     // const decodedUser = decoded.user;
        //     console.log("decoded: ", decoded);
        //     setUser((prevUser)=> {
        //         return {...prevUser,name: decoded.user.userName}
        //     })
        //   }
      },[])
    
    useEffect(()=> {
        if(location.state) {
            setUser(location.state.userData);
        }
    },[location])
    return (
        <div>
            <Navbar user={user}/>
            <Dashboard/>
        </div>
    )
}

export default HomeScreen;