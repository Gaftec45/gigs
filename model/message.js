const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to sender user
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to receiver user
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }, // Reference to conversation
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
