import React, { useEffect, useState } from 'react';
import './ConversationList.css';
import ConversationBox from '../ConversationBox/ConversationBox';
import loader from "../../assets/loader3.gif"

const ConversationList = ({ selectedPage, setCurrentConversation, currentConversation, messageArrayChanged, setLoadingConversations, setConversationsLength }) => {
  const [, setState] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = ()=> {
    setLoading(true);
    setTimeout(()=> {
    setState((prev) => !prev)
    setLoading(false);
  },2000);
  }
 function compare( a, b ) {
    if ( a.lastMessageCreatedAt > b.lastMessageCreatedAt ){
      return -1;
    }
    if ( a.lastMessageCreatedAt < b.lastMessageCreatedAt ){
      return 1;
    }
    return 0;
  }

  const backendHost = "https://fb-helpdesk-richpanel.onrender.com";

  const [conversations, setConversations] = useState([]);

  useEffect(() => {

    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        console.log("selectedPage: ", selectedPage);
        const response = await fetch(`${backendHost}/api/conversation/get-all-conversations?pageId=${selectedPage.pageId}`,
        {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }
        );
        const data = await response.json();
        await data.sort( compare );
        const fetchedConversations = data;
        console.log("fetchedConversations123: ", fetchedConversations);
        
        setConversationsLength(data.length);
        setCurrentConversation(data[0]);
        console.log("currentConversation123: ", data[0]);
 
        setConversations(data);
        setLoadingConversations(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoadingConversations(false);
      }
    };

    if (selectedPage) {
      fetchConversations();
    }
  }, [selectedPage, messageArrayChanged]);

  const handleConversationClick = (conversation) => {
    setCurrentConversation(conversation)
    console.log(`Conversation ${conversation} clicked`);
  };

  const handleCheckButtonClick = (conversationId) => {
    console.log(`Check button clicked for Conversation ${conversationId}`);
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <div className='convo-header-subdiv1'>
        <div className='menu-icon'><i className="fa-solid fa-bars-staggered"></i></div>
        <h3>Conversations</h3>
        </div>
        <div className="refresh-button" onClick={() => handleRefresh()}>
          {loading ?

          <img className='loader-gif' src={loader} alt="loading.." />
          :
        <i className="refresh-icon fa-solid fa-rotate-right"></i>
          }
        </div>
      </div>
      <div className="conversation-body">
        {conversations.length>0 && conversations.map((conversation) => (
          <ConversationBox
            isSelected = {conversation._id===currentConversation._id?true:false}
            key={conversation._id}
            page = {selectedPage}
            data={conversation}
            onClick={() => handleConversationClick(conversation)}
            onCheckClick={() => handleCheckButtonClick(conversation.id)}
            setCurrentConversation = {setCurrentConversation}
            messageArrayChanged = {messageArrayChanged}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
