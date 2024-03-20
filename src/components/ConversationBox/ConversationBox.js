import React, { useEffect, useState } from 'react';
import './ConversationBox.css';

const ConversationBox = ({ data, onClick, onCheckClick, page, isSelected, setCurrentConversation, messageArrayChanged }) => {
    const { conversationId, _id } = data;
    const [customerId, setCustomerId] = useState(null);
    const [senderName, setSenderName] = useState("User");
    const [messagesArray,setMessagesArray] = useState([]);
    const [customerData, setCustomerData] = useState({name: "user", picture: {data: {}}});
    const [selected, setSelected] = useState(false);
    const [messageData, setMessageData] = useState({id: "",created_time: "",from:{},to:[],message:""});
    const [messages,setMessages] = useState([]);
    const [firstMessage,setFirstMessage] = useState(null);
    const [firstMessageData,setFirstMessageData] = useState({id: "",created_time: "",from:{},to:[],message:""});
    const [message,setMessage] = useState(null);
    const [messageContent,setMessageContent] = useState("");
    const [currentPage,setCurrentPage] = useState({pageId: ""});
    const [time, setTime] = useState(Date.now());

    useEffect(()=> {
      if(page) {
        setCurrentPage(page);
        console.log("page: ", page);
      }
    },[page])
    
    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect(()=> {
      if(data.messages) {
        setMessagesArray(data.messages);
      }
    },[data,messageArrayChanged])

    useEffect(()=> {
      console.log("messageArrayChanged: ", messageArrayChanged);
    },[messageArrayChanged])
    

    useEffect(()=> {
      if(data.customerId) {
        setCustomerId(data.customerId);
      }
    },[data,messageArrayChanged])

    const fetchUserDetails = async (id) => {
      try {
        const response = await fetch(`https://graph.facebook.com/v10.0/${id}?fields=id,name,picture&access_token=${page.access_token}`);
        const data = await response.json();
        console.log("dataUser: ", data);
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    useEffect(()=> {
       if(customerId) {
        fetchUserDetails(customerId);
       }
    },[customerId])

    useEffect(() => {
        const fetchMessages = async () => {
          try {
            if(messagesArray.length>0) {

            setMessages(messagesArray);
            setFirstMessageData(messagesArray[messagesArray.length-1]);
            setMessageData(messagesArray[0]);
            const lastMessage = messagesArray[messagesArray.length-1];
            const from = lastMessage.from;
            // const condition = from.id===page.id;
            setSenderName(from.id==page.pageId?"You":customerData.name.split(" ")[0]);

            console.log("messageData: ", messageData);
            console.log("firstMessageData: ", firstMessageData);
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
    
        if (data) {
          fetchMessages();
        }
      }, [data,customerData,messagesArray, firstMessage,messageData, messageArrayChanged,currentPage]);

      useEffect(()=>{
        if(firstMessageData.message){
          const body = firstMessageData.message;
          setMessageContent(body.length<25?body:body.slice(0,25).concat("..."));
        }
      },[firstMessageData,messageArrayChanged])
    
  
    const handleConversationClick = () => {
      setCurrentConversation(data);
      isSelected=true;

      console.log("messageData: ",message);
      setSelected(true);
      onClick(_id);
    };
  
    const handleCheckButtonClick = (e) => {
      e.stopPropagation(); 
      onCheckClick(_id);
    };

    const calculateTimeDifference = (timestamp) => {
      const currentTime = new Date();
      const messageTime = new Date(timestamp);
      const timeDifference = +currentTime - +messageTime;
      const minutesDifference = Math.floor(timeDifference / (1000 * 60));
      
      if(minutesDifference===0) {
        return 'now';
      }
      else if (minutesDifference < 60) {
        return `${minutesDifference} min`;
      } else {
        if(minutesDifference >= 1440) {
          const daysDifference = Math.floor(minutesDifference / 1440);
          return `${daysDifference} d`;
        }
        const hoursDifference = Math.floor(minutesDifference / 60);
        return `${hoursDifference} h`;
      }
    };

  
    return (
      <div
        className={`conversation-box ${isSelected ? ' selected' : 'unselected'}`}
        onClick={handleConversationClick}
      >
        <div className="conversation-info">
          <div style={{
                display: "flex",
                gap: "5px"
          }}>
        <input type="checkbox" onChange={handleCheckButtonClick} />
          <h4>{customerData.name}</h4>
          </div>
          <span className='timediff'>{calculateTimeDifference(firstMessageData.created_time)}</span>
        </div>
        <div className="message-content">

          <span> <span className='senderNameinConvoBox'> {senderName}</span>: {messageContent}</span>
        </div>
      </div>
    );
  };
  
  export default ConversationBox;
