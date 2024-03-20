import React, { useEffect, useState } from 'react';
import './CustomerProfile.css';

const UserProfile = ({customerData, onlineStatus}) => {
  const [profilePictureUrl,setProfilePictureUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg");
  const [status,setStatus] = useState("offline");

  useEffect(()=>{
    if(onlineStatus) {
      setStatus(onlineStatus);
    }
  },[onlineStatus])


  const phoneNumber = "9288292002";
  return (
    <div className="user-profile">

      <div>
      <img src={profilePictureUrl} alt="User display picture" className="avatar-img rounded-circle" />
      </div>
      <div className='customerNameDiv'>
        {customerData.name}
      </div>
      <div>
      <div className={`status ${status==='online' ? 'online' : 'offline'}`}><i className={` fa-solid fa-circle ${status==='online' ? 'online' : 'offline'}`}></i>{status}</div>
      </div>
      <div className='buttons-div'>
      {phoneNumber && <div className="utilsbtn"> <i className="fa-solid fa-phone"></i>Call</div>}

      <div className="utilsbtn view-profile-button">
      <i className='fas fa-user-circle'></i>
        Profile
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
