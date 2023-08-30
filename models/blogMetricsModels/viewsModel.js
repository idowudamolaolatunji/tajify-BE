const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
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

const View = mongoose.model('View', viewSchema);

module.exports = View;
