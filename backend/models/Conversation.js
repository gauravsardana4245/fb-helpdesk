const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  pageId: String,
  conversationId: String,
  customerId: String,
  lastMessageCreatedAt: Date,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

module.exports = mongoose.model('Conversation', conversationSchema);