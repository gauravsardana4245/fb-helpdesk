import React, { useEffect, useRef, useState } from 'react';
import Message from '../Message/Message';
import './ConversationThread.css';
import sendButton from "../../assets/send.png"
import sendDisabledButton from "../../assets/sendDisabled.png"
import io from 'socket.io-client';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const ConversationThread = ({selectedPage, currentConversation, userFaceBookId, userDetails, socket,messageArrayChanged, setMessageArrayChanged ,loadingConversations, conversationsLength}) => {
  const [loadingConversations2, setLoadingConversations2] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [conversationsLengthNew, setConversationsLengthNew] = useState(1);
  const [messageArray, setMessageArray] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [conversatonId, setConversatonId] = useState(null);
  const [customerData, setCustomerData] = useState({name: "user", picture: {data: {}}});
  const [lastMessage, setLastMessage] = useState(null);
  const [messageData, setMessageData] = useState({from: {}});
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [backendHost, setBackendHost] = useState("http://localhost:5000");
  const [canReply, setCanReply] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const [page, setPage] = useState(null);

  const messageThreadRef = useRef(null);

  useEffect(()=> {
    setConversationsLengthNew(conversationsLength);
  },[conversationsLength])

  useEffect(()=> {
    if(selectedPage) {
      setPage(selectedPage);
    }
  },[selectedPage])

  useEffect(()=> {
    if(selectedPage) {
      setPage(selectedPage);
    }
  },[selectedPage])

  useEffect(() => {
    // const socket = io('http://localhost:5000');
    console.log("received websocket event");

    socket.on('newMessage', (data) => {
      console.log('New message received inchat:', data);
      const {pageId,created_time,from,to,message} = data;
      setMessageArray((prev)=> [...prev,{pageId,created_time,from,to,message}]);
      setMessageArrayChanged((prev)=>!prev);
    });

    return () => {
      socket.off('newMessage'); 
    };
  }, []);

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v10.0/${id}?fields=id,name,email,picture&access_token=${page.access_token}`);
      const data = await response.json();
      console.log("dataUSer: ", data);
      setCustomerData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(()=> {
    if(currentConversation) {
    if(currentConversation.customerId) {
      console.log("currentConversation: ", currentConversation);
      setCustomerId(currentConversation.customerId);
    }
  }
  },[currentConversation])

  useEffect(()=> {
     if(customerId) {
      console.log("customerId: ", customerId);
      fetchUserDetails(customerId);
     }
  },[customerId])

  useEffect(()=> {
    if(currentConversation) {
      if(currentConversation.messages) {
        setLoadingConversations2(false);
        setConversatonId(currentConversation._id);
        const fetchedMessageArray = currentConversation.messages;
        const reverseArray = fetchedMessageArray.slice().reverse();
        console.log("messageArray1234: ", fetchedMessageArray);
        setMessageArray(fetchedMessageArray);
        
        setLastMessage(reverseArray[0]);
        console.log("lastMessage: ", reverseArray[0]);

        const currentTime = new Date();
        const lastMessageTime = new Date(reverseArray[0].created_time);
        const timeDifference = +currentTime - +lastMessageTime;

        setCanReply(timeDifference < 24 * 60 * 60 * 1000);
      }
  }
  },[currentConversation])


  useEffect(() => {
    if (messageThreadRef.current) {
      messageThreadRef.current.scrollTop = messageThreadRef.current.scrollHeight;
    }
  }, [messages, messageArray]);



  useEffect(()=> {
    if(userDetails) {
      setUser(userDetails);
      console.log("userDetailsConversationThread: ", user);
    }
  },[userDetails])
  


  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSendingMessage(true);
    console.log("newMessage: ", newMessage)
    try {
      const response = await fetch(`${backendHost}/api/message/send-message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },

        body: JSON.stringify({
          customerId: customerId,
          newMessageContent: newMessage,
          page: page,
          conversationId: conversatonId
        })
      }
      );
      const data = await response.json();
      setMessageArrayChanged((prev)=>!prev);
      setNewMessage('');
      // const {pageId,created_time,from,to,message} = data;
      // setMessageArray((prev)=> [...prev,{pageId,created_time,from,to,message}]);
      console.log("sentMessage: ", data);
      setSendingMessage(false);
      messageThreadRef.current.scrollTop = messageThreadRef.current.scrollHeight;
    } catch (error) {
      alert("Could not send message. Please try after some time!")
      console.error('Error sending message:', error);
      setSendingMessage(false);
    }
    // setNewMessage('');
    
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // if(conversationsLength===0) {
  //   return (<div>No conversations to display</div>) 
  // }
  
  return (
    <div className="conversation-thread">
      <div className='conversation-thread-header'>
      {loadingConversations2 && (
        <div className="loading-overlay">
          {conversationsLengthNew===0 ?  <div className='noConversationsDiv'> 
            <div>No conversations to display </div>
            <button onClick={() => navigate(-1)}>Back to Page Selection</button> 
            </div> :
          (<div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
         <div className='actionText'> Loading Conversations </div>
        <BeatLoader color="grey"/> 
        </div>)
        }
        </div>
      )}
      <h3>{customerData.name}</h3>
      </div>
      <div className='conversation-box-main'>
      <div className="message-thread" ref={messageThreadRef}>
        {/* {loadingConversations && <div>Loading Conversations... </div>} */}
        {messageArray.length>0 && messageArray.map((message, index) => (
          <Message
          userDetails={userDetails}
          customerData= {customerData}
           key={index} 
           data={message} 
           page={page} 
           />
        ))}
      </div>
      { canReply ?
      <form onSubmit={handleSendMessage}>
      <div className="message-input">
        <input
          type="text"
          placeholder={`Message ${customerData.name}`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        {newMessage.trim() &&
        ( sendingMessage ?
          <div 
          className='sendButtonDivDisabled'
          >
         <img className='sendButtonDisabled' src={sendDisabledButton} alt="Send" />
            {/* <i className="send-button fa-solid fa-paper-plane"></i> */}
          </div>
          :
          <div 
          className='sendButtonDiv'
          onClick={handleSendMessage}
          >
         <img className='sendButton' src={sendButton} alt="Send" />
            {/* <i className="send-button fa-solid fa-paper-plane"></i> */}
          </div>
        )
        }
      </div> 
      </form> :
      <div className="cannot-reply-message">
            <span>Conversations are closed automatically after 24 hours of last message.</span>
          </div>
}
      </div>  
    </div>
  );
};
export default ConversationThread;
