const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const sendMessage = async (req, res) => {
  try {
    const {page, newMessageContent,customerId, conversationId}= req.body;
    const response = await fetch(`https://graph.facebook.com/v10.0/${page.pageId}/messages?access_token=${page.access_token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          'recipient': {
            'id': customerId
          },
          'messaging_type': 'RESPONSE',
          'message': {
            'text': newMessageContent
          }
        })
      }
      );
      const data = await response.json();
      console.log("dataResponse: ", data);
      const messageId  = data.message_id;

      const response123 = await fetch(`https://graph.facebook.com/v10.0/${messageId}?fields=id,created_time,from,to,message&access_token=${page.access_token}`);
      const newMessageData = await response123.json();
      const {id,created_time,from,to,message} = newMessageData;
      const newMessage = new Message({
        pageId: page.pageId,
        messageId: id,
        created_time: created_time,
        to: to,
        from: from,
        message: message
      })

      await newMessage.save();
      const updatedConversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $push: { messages: newMessage }, lastMessageCreatedAt: created_time }
     )

    res.status(201).json({message: "message sent successfully"});
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllMessages =  async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const {messageId} = req.query;
    const message = await Message.findOne({messageId: messageId});
    res.status(200).json(message);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const handleMessengerEvent = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    let conversation = await Conversation.findOne({
      customerId: from.id,
    }).sort({ 'messages.created_at': -1 });

    if (!conversation) {

      conversation = new Conversation({
        customerId: from.id,
      });
    } else {
      // Checking if the last message was sent more than 24 hours ago
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage && Date.now() - lastMessage.timestamp.getTime() > 24 * 60 * 60 * 1000) {
        // Creating a new conversation if the last message was more than 24 hours ago
        conversation = new Conversation({
          customerId: from.id,
        });
      }
    }

    conversation.messages.push({
      from: from,
      to: to,
      message: message,
    });

    await conversation.save();

    res.json({ message: 'Message received and stored successfully' });
  } catch (error) {
    console.error('Error handling messenger event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessageById,
  handleMessengerEvent
}
