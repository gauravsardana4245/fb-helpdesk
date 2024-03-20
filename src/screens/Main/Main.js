import Sidebar from 'components/Sidebar/Sidebar'
import React, { useEffect, useState } from 'react'
import {Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom'
import AgentScreen from 'screens/AgentScreen/AgentScreen'
import AnalyticsScreen from 'screens/AnalyticsScreen/AnalyticsScreen'
import UserScreen from 'screens/UserScreen/UserScreen'
import './Main.css';

const Main = ({socket}) => {
    const [currentPage,setCurrentPage] = useState(null);
    const [userDetails,setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { page, userFacebookId } = location.state || {};
    const accessToken = page?.accessToken;
    const navigate = useNavigate();

    // useEffect(()=> {
    //     setCurrentPage(page)
    //     console.log("page123: ", page);
    // },[page])

    useEffect(()=> {
      if(!localStorage.getItem("token")) {
        navigate('/login');
      }
    },[localStorage])

    useEffect(() => {
        const fetchData = async () => {
          try {
            setCurrentPage(page);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {

            setLoading(false);
          }
        };
    
        fetchData(); 
      }, [page, location.pathname]);

      useEffect(() => {
        const fetchUserDetails = async () => {
          try {
            if (!userFacebookId) {
              return; 
            }
            const response = await fetch(`https://graph.facebook.com/v10.0/${userFacebookId}?fields=id,name,email,picture&access_token=${page.access_token}`);
            const data = await response.json();
            console.log("dataUSer: ", data);
            setUserDetails(data);
            // setProfilePictureUrl(data.picture.data.url);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
       
        // if (userFacebookId) {
          fetchUserDetails();
        // }
      }, [userFacebookId, page, location.pathname]);

    if (loading) {
        return <div>Loading...</div>;
      }

  return (
    <div className='MainScreen'>
        <div className='SideBar-Div'>
      <Sidebar userDetails={userDetails} page={currentPage} userFacebookId={userFacebookId} accessToken={accessToken} />
      </div>
      <div className='SideScreen-Div'>
      <Routes>
      <Route  path="/" element={<AgentScreen socket={socket} userDetails={userDetails} page={currentPage} userFaceBookId={userFacebookId} accessToken={accessToken} />} />
      <Route  path="/conversations" element={<AgentScreen socket={socket}  userDetails={userDetails} page={currentPage} userFaceBookId={userFacebookId}  accessToken={accessToken}/>} />
      <Route  path="/users" element={<UserScreen/>} />
      <Route  path="/analytics" element={<AnalyticsScreen/>} />
      </Routes>
      </div>
    </div>
  )
}

export default Main
