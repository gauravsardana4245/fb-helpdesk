import React, { useEffect, useState } from 'react';
import './AgentScreen.css'; 
import { useLocation } from 'react-router-dom';
import Sidebar from 'components/Sidebar/Sidebar.js';
import ConversationList from 'components/ConversationList/ConversationList.js';
import ConversationThread from 'components/ConversationThread/ConversationThread.js';
import CustomerProfile from 'components/CustomerProfile/CustomerProfile.js';

const AgentScreen = (props) => {

  const {accessToken, userFaceBookId, page, userDetails, socket} = props;
  const [messageArrayChanged,setMessageArrayChanged] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversationsLength, setConversationsLength] = useState(1);
  const [loadingConversations, setLoadingConversations] = useState(false);

  useEffect(()=> {
    console.log("messageArrayChanged: ", messageArrayChanged);
  },[messageArrayChanged])
  

  useEffect(() => {
    setSelectedPage(page)
    console.log("selectedPage123: ", selectedPage);
  }, []);

  return (
    <div className="agent-screen container-fluid mt-5">
      <div className="agent-screen-div">
        <div className="conversation-list-div">
          <ConversationList setConversationsLength={setConversationsLength} setLoadingConversations={setLoadingConversations}  messageArrayChanged={messageArrayChanged} currentConversation={currentConversation} selectedPage={selectedPage} setCurrentConversation={setCurrentConversation}/>
        </div>
        <div className="conversation-thread-div">

              <ConversationThread conversationsLength={conversationsLength} loadingConversations={loadingConversations} messageArrayChanged={messageArrayChanged} setMessageArrayChanged={setMessageArrayChanged} socket={socket} userDetails={userDetails} userFaceBookId={userFaceBookId} selectedPage={selectedPage} currentConversation={currentConversation}/>

        </div>
        <div className="customer-profile-div">
          <CustomerProfile selectedPage={selectedPage} currentConversation={currentConversation}/>
        </div>
      </div>
    </div>
  );
};

export default AgentScreen;
