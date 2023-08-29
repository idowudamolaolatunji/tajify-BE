const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
}, {
    timestamps: true,
});

const Saved = mongoose.model('Saved', savedSchema);
module.exports = Saved;