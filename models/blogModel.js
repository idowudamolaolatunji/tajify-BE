const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Provide a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'provide your blog content'],
        trim: true
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    author: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0
    },
    share: {
        type: Number,
        default: 0
    },
    // comment,
    // saved,
    // gifts,
    // views,
    tags: [String],
    category: {
        type: String,
        enum: ['news', 'sport', 'travel', 'future', 'culture', 'health', 'style'],
        default: 'news'
    },
    type: {
        type: String,
        enum: ['open', 'premium'],
        default: 'open'
    },
    isPremium: {
        type: Boolean,
        default: null
    },
    isFree: {
        type: Boolean,
        default: null
    },
    subscriptionFee: {
        type: Number,
        default: 0
    },
    slug: String,
    blogUrl: String,
    
    // You can add more fields like tags, category, comments, etc. as needed.
});


blogSchema.pre('save', function(next) {
    const slug = slugify(this.title, {lower: true, replacement: '-'});
    this.slug = `${slug}-${this._id}`;
    next();
})

blogSchema.methods.calculateEngagementScore = function() {
    return (this.likes * 3) + (this.comments * 2) + (this.shares * 5) + (this.view * 3);
};

blogSchema.methods.isTrending = function() {
    const now = new Date();
    const fourtyEightHoursAgo = new Date(now - (48 * 60 * 60 * 1000));
    const engagementThreshold = 100;

    return this.createdAt > fourtyEightHoursAgo && this.calculateEngagementScore() > engagementThreshold;
};


const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog;