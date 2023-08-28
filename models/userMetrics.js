const mongoose = require('mongoose');

const userMetricsSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    totalPosts: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalInvites: {
        type: Number,
        default: 0
    },
    // totalEarnings: {
    //     type: Number,
    //     default: 0
    // },
});

const UserMetrics = mongoose.model('UserMetrics', userMetricsSchema);
module.exports = UserMetrics;