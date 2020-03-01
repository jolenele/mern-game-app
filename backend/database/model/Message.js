const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema(
  {
    content: String,
    username: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
