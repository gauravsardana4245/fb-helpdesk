const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const createConversation = async (req, res) => {
    try {
      const newConversation = await Conversation.create(req.body);
      res.status(201).json(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const updateConversation = async (req, res) => {
    try {
        const {conversationId, conversation}= req.body;
      const updatedConversation = await Conversation.findOneAndUpdate({conversationId:conversationId},conversation,{new:true});
      res.status(201).json(updatedConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const createOrUpdateConversations = async (page) => {
    try {
      const existingConversations = await Conversation.find({ pageId: page.id });
  
      if (existingConversations.length > 0) {
        await Message.deleteMany({ pageId: page.id });
        await Conversation.deleteMany({ pageId: page.id });
      }

      // fetching conversations of that page
      const conversationsResponse = await fetch(`https://graph.facebook.com/v10.0/${page.id}/conversations?access_token=${page.access_token}`);
      const data = await conversationsResponse.json();
      console.log("data1234: ", data.data); 
      const conversationsArray = data.data;
     
      for (const conversationObject of conversationsArray) {
      
        // Splitting the conversation based on the gap of more than 24 hours
        const conversationsToStore = [];
        let currentConversation = [];

        const response1 = await fetch(`https://graph.facebook.com/v10.0/${conversationObject.id}?fields=messages&access_token=${page.access_token}`);
        const messagesData = await response1.json();
        const messageArr = messagesData.messages.data;
        // console.log("messageArrfromBackend: ", messageArr)
        const sortedMessages = messageArr.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));
        // console.log("sortedMessages: ", sortedMessages)
        const firstMessage = sortedMessages[0];


        const response2 = await fetch(`https://graph.facebook.com/v10.0/${firstMessage.id}?fields=id,created_time,from,to,message&access_token=${page.access_token}`);
        const messageData = await response2.json();


        for (let i = 0; i < messageArr.length; i++) {
          const currentMessage = messageArr[i];
          const previousMessage = messageArr[i - 1];
  
          if (previousMessage && isTimeGapGreaterThan24Hours(previousMessage.created_time, currentMessage.created_time)) {

            conversationsToStore.push(currentConversation);
  

            currentConversation = [currentMessage];
          } else {

            currentConversation.push(currentMessage);
          }
        }
  
        conversationsToStore.push(currentConversation);
        // console.log("conversationsToStore: ", conversationsToStore);
  
        for (const conversation of conversationsToStore) {
          const sortedConversation = conversation.sort((a, b) => new Date(a.created_time) - new Date(b.created_time));

          let firstMessage2 = null;
          let firstMessageSenderId = null;
          for(let message of sortedConversation) {
            console.log("curr_message: ", message);
            const currMessageRequest = await fetch(`https://graph.facebook.com/v10.0/${message.id}?fields=id,created_time,from,to,message&access_token=${page.access_token}`);
            const currtMessageData = await currMessageRequest.json();
            const messageSender = currtMessageData.from;
            const messageSenderId = messageSender.id;
            if(messageSenderId!==page.id) {
              firstMessage2 = message;
              firstMessageSenderId = messageSenderId;
              break;
            }
          }
          console.log("firstMessage21: ", firstMessage2);
          if(firstMessage2===null) {
            continue;
          }
          console.log("firstMessage22: ", firstMessage2);
          
          const newConversation = new Conversation({
            pageId: page.id,
            conversationId: conversationObject.id,
            customerId: firstMessageSenderId,
            lastMessageCreatedAt: new Date(sortedConversation[sortedConversation.length - 1].created_time),
          });

          console.log("sortedConversation123: ", sortedConversation);

          for(const messageItem of sortedConversation ) {
          
          const response123 = await fetch(`https://graph.facebook.com/v10.0/${messageItem.id}?fields=id,created_time,from,to,message&access_token=${page.access_token}`);
          const currentMessageData = await response123.json();
          const {id,created_time,from,to,message} = currentMessageData;
          const newMessage = new Message({
            pageId: page.id,
            messageId: id,
            created_time: created_time,
            to: to,
            from: from,
            message: message
          })

          await newMessage.save();
          newConversation.messages.push(newMessage._id);

        }
          
          await newConversation.save();
          // console.log("conversation123: ", conversation);
      }
        console.log(`Conversations for conversationId ${conversationObject.id} stored successfully.`);
      }
  
     return ({message: 'All conversations stored successfully.', success: true});
    } catch (error) {
      console.error('Error creating or updating conversations:', error);
      return ({ error: 'Internal Server Error', success: false });
    }
  };
  

const isTimeGapGreaterThan24Hours = (time1, time2) => {
  const gapInMillis = Math.abs(new Date(time1) - new Date(time2));
  const hoursGap = gapInMillis / (1000 * 60 * 60);
  return hoursGap > 24;
};


const getAllConversations = async (req, res) => {
    try {
      const {pageId} = req.query;
      const conversations = await Conversation.find({pageId: pageId}).sort({lastMessageCreatedAt: -1}).populate('messages');
      res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const getConversationById = async (req, res) => {
    try {
        const {conversationId} = req.query;
      const conversations = await Conversation.findOne({conversationId: conversationId}).populate('messages');
      res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  module.exports = {
    createConversation,
    updateConversation,
    createOrUpdateConversations,
    getAllConversations,
    getConversationById
  }