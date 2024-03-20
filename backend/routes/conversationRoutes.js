const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/create-conversation', conversationController.createConversation);
router.post('/update-conversation', conversationController.updateConversation);
router.post('/create-or-update-conversations', conversationController.createOrUpdateConversations);
router.get('/get-all-conversations', conversationController.getAllConversations);
router.get('/get-conversation-by-id', conversationController.getConversationById);

module.exports = router;
