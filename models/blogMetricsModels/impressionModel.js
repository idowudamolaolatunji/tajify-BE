const mongoose = require('mongoose');

const impressionSchema = new mongoose.Schema({
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

const Impression = mongoose.model('Impression', impressionSchema);

module.exports = Impression;
