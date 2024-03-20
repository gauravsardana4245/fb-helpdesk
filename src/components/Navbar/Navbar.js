import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import { jwtDecode } from "jwt-decode";

const Navbar = ({user}) => {
    const [userData, setUserData] = useState({name: "user"});
    const [decodedData, setDecodedData] = useState({user: {name: "user"}});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogout = ()=> {
        setLoading(true);
        setTimeout(()=> {
            localStorage.removeItem('token');
            navigate('/login');
            setLoading(false);
        },2000)
    }   

    function parseJwt (token) {
        if(typeof token !== "undefined") {
        console.log("token: ", token);
        var base64Url = token.split('.')[1];
        console.log("base64Url: ", base64Url);
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
    }

    useEffect(()=> {
        if(localStorage.getItem("token")) {
            const token = localStorage.getItem("token")
            if(token!=null && (typeof token !== "undefined")) {
                const decoded = parseJwt(token);
                console.log("decoded: ", decoded);
                setDecodedData(decoded)
            }
            // const user = decodedData.decoded.user;
            // setUser
        }
    },[localStorage])

    useEffect(()=> {
        if(user) {
            setUserData(user);
        }
    },[user])

    return (
        <div className='navBar'>
            <div>

            </div>
            <div className='userBox'>
                <div 
                style={{
                    display: "flex",
                    gap: "7px",
                    color: "white"
                }}>
            <i className="fa-solid fa-user"></i>
                <div className='loggedInUserName'> {decodedData.user.name}</div>
                </div>
            <div onClick={()=> handleLogout()} className='logoutBtn'>
                {!loading? "Logout":
                // <div>
                    <ColorRing
                        visible={true}
                        height="25"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['black', 'black', 'black', 'black', 'black']}
                    />
                // </div>
                }
            </div>
            </div>
        </div>
    )
};

export default Navbar;