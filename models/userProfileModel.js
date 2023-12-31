const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    fullname: {
        type: String,
        lowercase: true,
        trim: true,
    },
    telephone: {
        type: Number,
    },
    portfolioLink: {
        type: String,
        trim: true
    },
    location: {
        type: String,
    },
    education: {
        type: String,
    },
    specialization: {
        type: [String],
    },
    interest: {
        type: [String]
    },
    jobTitle: {
        type: String,
    },
    businessName: {
        type: String,
    },
    bio: {
        type: String,
        trim: true,
        required: [true, 'Your profile should have an about me']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

userProfileSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v'
    });
    next();
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;

