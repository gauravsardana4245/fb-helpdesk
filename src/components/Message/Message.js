import React, { useEffect, useState } from 'react';
import './Message.css';

const Message = ({ data, page, userDetails, customerData}) => {
  const [user, setUser] = useState({
    name: "user",
    picture: {
      data: {
        url: "https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg"
      }
    }
  });
  const [customer,setCustomer] = useState({name: "user",picture: {data: {url: "https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg"}}});
  const [messageAuthor, setMessageAuthor] = useState({name: "user",picture: {data: {url: "https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg"}}});
  const [messageData, setMessageData] = useState({id: "",created_time: "",from:{},to:[],message:""});
  const [profilePictureUrl,setProfilePictureUrl] = useState("https://upload.wikimedia.org/wikipedia/commons/3/34/PICA.jpg");
  const [currentPage, setCurrentPage] = useState(null);
  const [id, setId] = useState("");
  const [messageClass, setMessageClass] = useState("received");
  const [messageAndImageClass, setMessageAndImageClass] = useState("");

  useEffect(()=> {
    if(page) {
      setCurrentPage(page);
    }
  },[page]);

  useEffect(()=> {
    if(data) {
      setMessageData(data);

      if(currentPage && data.from) {
        const condition = data.from.id === currentPage.pageId;
        setMessageAuthor(!condition ? customerData : user);
        // console.log("customerData: ", customerData);
        // console.log("messageAuthor: ", messageAuthor);
        // setProfilePictureUrl(messageAuthor.picture.data.url);
        setMessageClass(condition ? ' sent' : ' received');
        setMessageAndImageClass(condition ? 'reverse' : '');
      }
    }
  },[data,currentPage,customerData]);

  useEffect(()=> {
    if(userDetails) {
      setUser(userDetails)
    }
  },[userDetails]);

  useEffect(()=> {
    if(customerData) {
      setCustomer(customerData)
    }
  },[customerData]);

  
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
  
    if (isNaN(date.getTime())) {
      return 'Invalid time value';
    }
  
    const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  
    const dayWithZero = date.getDate().toString().padStart(2, '0');
  
    let hours = date.getHours();
    const amPm = hours >= 12 ? 'pm' : 'am';
  
    hours = hours % 12 || 12;
  
    const time12hr = `${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  
    const formattedTime = `${monthAbbreviation} ${dayWithZero}, ${time12hr} ${amPm}`;
  
    return formattedTime;
  };
    
  return (
    <div 
    className={`message ${messageClass}`}
    >
      <div className="message-content">
        <div className={`messageAndImage ${messageClass} ${messageAndImageClass}`}>
        <img src={profilePictureUrl} alt="user" />
        <div className={`messageBody ${messageClass}`}>{messageData.message}</div>
        </div>
        <div className={`messageDetails ${messageClass}`}>
        <span>{messageAuthor.name}</span>
        <span> - </span>
        <span>{formatMessageTime(messageData.created_time)}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
