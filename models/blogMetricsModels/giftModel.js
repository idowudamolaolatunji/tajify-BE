const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;
