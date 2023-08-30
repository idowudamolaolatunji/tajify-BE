const mongoose = require('mongoose');

const userMetricsSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId }],
    following: [{ type: mongoose.Schema.Types.ObjectId }],
    followerRequestsSent: [{ type: mongoose.Schema.Types.ObjectId }],
    followerRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId }],
    invites: [{ type: mongoose.Schema.Types.ObjectId }],
    totalPosts: {
        type: Number,
        default: 0
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
});

const UserMetrics = mongoose.model('UserMetrics', userMetricsSchema);
module.exports = UserMetrics;