const mongoose = require('mongoose');

const facebookPageSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  name: { type: String },
  access_token: { type: String, required: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facebookId: { type: String, required: true },
});

const FacebookPage = mongoose.model('FacebookPage', facebookPageSchema);

module.exports = FacebookPage;
