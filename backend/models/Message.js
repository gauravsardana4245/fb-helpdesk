const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  pageId: String,
  messageId: String,
  created_time: Date,
  from: {
    email: String,
    name: String,
    id: String,
  },
  to: 
    {
      data: [ {
      email: String,
      name: String,
      id: String,
      }
      ]
    },
  message: String,
  isDelivered: Boolean,
  isSeenByReceiver: Boolean
});

module.exports = mongoose.model('Message', messageSchema);