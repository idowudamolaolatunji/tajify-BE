const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    blog: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Blog',
        required: true,
    },
}, {
    timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
