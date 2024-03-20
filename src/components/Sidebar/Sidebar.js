import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; 
import helpdeskIcon from "../../assets/helpdesk.png"

const Sidebar = ({page, userFacebookId, accessToken, userDetails}) => {
  const [user,setUser] = useState(null);
  const [profilePictureUrl,setProfilePictureUrl] = useState("");
  const [currentLinkId,setCurrentLinkId] = useState(1);


  const sidebarLinks = [
    {id: 1,  label: 'Conversations', icon: <i className="fa-solid fa-inbox"></i>, to: '/main' },
    {id: 2, label: 'Users', icon: <i className="fa-solid fa-user-group"></i>, to: '/main' },
    {id: 3,  label: 'Analytics', icon: <i className="fa-solid fa-chart-line"></i>, to: '/main' },
  ];


  useEffect(()=> {
    if(userDetails) {
      setUser(userDetails);
      setProfilePictureUrl(userDetails.picture.data.url)
      console.log("userDetailsSidebar: ", user);
    }
  },[userDetails])


  const handleClick = (link)=> {
    console.log("clicked123");
    setCurrentLinkId(link.id);
    console.log(link.id);
  }

  return (
    <div className="sidebar">

      <div className="organization-icon">

        <img src={helpdeskIcon} alt="company icon" />
        </div>


      <ul className="sidebar-links">
        {sidebarLinks.map((link, index) => (
          <li className={`listItem`} key={index}>
            <div className={`routeLink ${link.id===currentLinkId?'selectedIcon':'unselectedIcon'}`} onClick={()=>handleClick(link)} >
              <span className="icon">{link.icon}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="user-avatar">
        <img src={profilePictureUrl} alt="User avatar" />
        <div className="online-dot"></div>
      </div>
    </div>
  );
};

export default Sidebar;
