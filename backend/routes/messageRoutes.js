const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send-message', messageController.sendMessage);
router.get('/get-all-messages', messageController.getAllMessages);
router.get('/get-message-by-id', messageController.getMessageById);
router.post('/handle-event', messageController.handleMessengerEvent);

module.exports = router;
