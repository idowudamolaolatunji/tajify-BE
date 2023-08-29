const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
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

const Share = mongoose.model('Share', shareSchema);

module.exports = Share;
