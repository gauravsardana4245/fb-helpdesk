const User = require('../models/User');
const FacebookPage = require('../models/FacebookPage');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { createOrUpdateConversations } = require('./conversationController');


const connectFacebook = async (req, res) => {
  const { accessToken } = req.body;
  const loggedInUser = req.user.user.id;
  console.log("user: ", loggedInUser)

  try {
    const response = await fetch(`https://graph.facebook.com/me?fields=id,email,name&access_token=${accessToken}`);
    const data = await response.json();
    const { id, email, name } = data;
    console.log("data: ", data);
    const user = await User.findOneAndUpdate(
      { _id: loggedInUser },
      { $set: { facebookId: id, facebookEmail: email, facebookName: name } },
      { new: true }
    );

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getConnectedPages = async (req,res)=> {
  try {
    const {userFacebookId} = req.query;
    const pages = await FacebookPage.find({facebookId: userFacebookId});
    res.json(pages).status(200);
  }
  catch (error) {
    console.error('Error fetching connected pages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const connectPage = async (req, res) => {
  try {
    const { page } = req.body;
    const userId = req.user.user.id;
    const userDetails = await User.findById(userId);
    const facebookId = userDetails.facebookId;

    const existingPage = await FacebookPage.findOne({ pageId: page.id , facebookId: facebookId });

    if (existingPage) {
      return res.status(400).json({ message: 'Page already connected by the user', existingPage });
    }

    const resData = await createOrUpdateConversations(page);
    if(resData.success==true) {
    const newPage = new FacebookPage({
      name: page.name,
      pageId: page.id,
      access_token: page.access_token,
      facebookId: facebookId,
    });

    await newPage.save();
    res.json({ message: 'Pages connected successfully', success: true});
  }
  else {
    res.json({ message: 'Could not save pages', success: false});
  }

  } catch (error) {
    console.error('Error connecting Facebook pages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const disconnectPage = async (req, res) => {
  try {
    const { pageId } = req.body;
    const userId = req.user.user.id;
    const userDetails = await User.findById(userId);
    console.log("user: ", userDetails)
    console.log("pageId: ", pageId)
    const facebookId = userDetails.facebookId;

    const deletedPage = await FacebookPage.findOneAndDelete({ pageId: pageId, facebookId: facebookId });

    const existingConversations = await Conversation.find({ pageId: pageId });
  
    if (existingConversations.length > 0) {
      await Message.deleteMany({ pageId: pageId });
      await Conversation.deleteMany({ pageId: pageId });
    }

    res.json({page: deletedPage, message: 'Page disconnected successfully',success: true });
  } catch (error) {
    console.error('Error disconnecting Facebook pages:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};


module.exports = {
  connectFacebook,
  getConnectedPages,
    connectPage,
    disconnectPage
}