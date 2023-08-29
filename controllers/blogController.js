
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

// Get all Blogs for all Users
exports.getAllBlog = async(req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            status: 'success',
            data: {
                count: blogs.length,
                blogs
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// Create User Blog
exports.createBlog = async(req, res) => {
    try {
        // const creatorId = req.user._id;
        const creatorId = req.body.creator;
        const creator = User.findById(creatorId);
        const newBlog = await Blog.create({ ...req.body, author: creator.username, creator: creatorId });
        if (!creator) {
            return res.status(404).json({ message: 'user not found' });
        }
        // const newBlog = await Blog.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                blog: newBlog
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong'
        });
    }
};

// Get Blogs catalog for User
exports.getUserBlogs = async(req, res) => {
    try {
        const userId = req.user._id;
        const userBlogs = await Blog.find({ creator: userId });

        res.status(200).json({
            status: 'success',
            count: userBlogs.length,
            data: {
                blogs: userBlogs
            }
        });
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};

// Get Blogs Posted By A User
exports.getBlogsbyCreatorSlug = async(req, res) => {
    try {
        const requestedCreatorSlug = req.params.creatorSlug;
        const creatorId = await User.findOne({ slug: requestedCreatorSlug });
        const creatorBlogs = await Blog.find({ creator: creatorId });
        res.status(200).json({
            status: 'success',
            count: creatorBlogs.length,
            data: {
                blogs: creatorBlogs
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        })
    }
}


// Get single blog Posted By A User
exports.getOneBlogbyCreatorSlug = async(req, res) => {
    try {
        const requestedCreatorSlug = req.params.creatorSlug;
        const creatorId = await User.findOne({ slug: requestedCreatorSlug });
        const creatorBlogs = await Blog.find({ creator: creatorId });
        // const blog = creatorBlogs.filter(blog => blog._id === req.params.blogId);
        const blog = creatorBlogs.find(req.params.blogId)
        res.status(200).json({
            status: 'success',
            data: {
                blog
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        })
    }
}


// Get a single Blog
exports.getBlog = async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                blog
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};


// Update Blog
exports.updateBlog = async(req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                blog: updatedBlog
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'something went wrong'
        });
    }
};

// Delete Blog
exports.deleteBlog = async(req, res) => {
    try {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        })
    }
};

// get blogs by tags
exports.getBlogsByTags = async(req, res) => {
    try {
        const { tags } = req.params;
        const categorisedBlogs = Blog.find({ tags });
        if(!categorisedBlogs) {
            return res.status(400).json({ message: 'No blog post in this category' });
        }

        return res.status(200).json({
            status: 'success',
            count: categorisedBlogs.length,
            data: {
                blogs: categorisedBlogs,
            }
        })
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        })
    }
}


// Get Blogs by Category
exports.getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const categorizedBlogs = await Blog.find({ category });
        
        res.status(200).json({
            status: 'success',
            count: categorizedBlogs.length,
            data: {
                blogs: categorizedBlogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// Get Blogs by Most Liked
exports.getBlogsByMostLiked = async (req, res) => {
    try {
        const blogs = await Blog.find().sort('-likes');
        
        res.status(200).json({
            status: 'success',
            count: blogs.length,
            data: {
                blogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// Get Blogs by Most Viewed
exports.getBlogsByMostViewed = async (req, res) => {
    try {
        const blogs = await Blog.find().sort('-views');
        
        res.status(200).json({
            status: 'success',
            count: blogs.length,
            data: {
                blogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// Get Blogs by Most Shared
exports.getBlogsByMostShared = async (req, res) => {
    try {
        const blogs = await Blog.find().sort('-shares');
        
        res.status(200).json({
            status: 'success',
            count: blogs.length,
            data: {
                blogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// get most engaging post
exports.getBlogsByMostEngaging = async (req, res) => {
    try {
        const allBlogs = await Blog.find();
        
        // Simulate an algorithm that ranks blogs based on engagement factors
        const rankedBlogs = allBlogs.map(blog => {
            const engagementScore = blog.calculateEngagementScore(blog);
            // return { ...blog._doc, engagementScore };
            console.log(...blog._doc, engagementScore)
        });
        rankedBlogs.sort((a, b) => b.engagementScore - a.engagementScore);

        // // Limit the response to a specific number (e.g., 30) of blogs
        // const responseBlogs = rankedBlogs.slice(0, 30);

        res.status(200).json({
            status: 'success',
            count: rankedBlogs.length,
            data: {
                blogs: rankedBlogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// trending blogs
exports.getTrendingPosts = async (req, res) => {
    try {
        const allBlogs = await Blog.find();

        // Simulate an algorithm to determine trending posts
        const trendingBlogs = allBlogs.filter(blog => blog.isTrending(blog));

        res.status(200).json({
            status: 'success',
            count: trendingBlogs.length,
            data: {
                blogs: trendingBlogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};




// const page = req.query.page || 1; // Get the page number from the request query
// const limit = 30; // Number of documents per page
// const skip = (page - 1) * limit;
// const blogs = await Blog.find().sort('-shares').skip(skip).limit(limit);




/*
// Hashtag algorithm for later
const Blog = require('../models/blogModel');

// Get Blogs by Hashtag (Emulating Modern Social Media Hashtags Algorithm)
exports.getBlogsByHashtag = async (req, res) => {
    try {
        const { hashtag } = req.params;
        const allBlogs = await Blog.find();
        
        // Simulate an algorithm that ranks blogs based on relevance to the hashtag
        const rankedBlogs = allBlogs.map(blog => {
            const relevance = calculateRelevance(blog, hashtag);
            return { ...blog._doc, relevance };
        });

        // Sort blogs by relevance in descending order
        rankedBlogs.sort((a, b) => b.relevance - a.relevance);
        
        res.status(200).json({
            status: 'success',
            count: rankedBlogs.length,
            data: {
                blogs: rankedBlogs,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong',
        });
    }
};

// Calculate relevance of a blog to a hashtag (for simulation purposes)
function calculateRelevance(blog, hashtag) {
    // Emulate a scoring mechanism based on hashtag presence in title, content, etc.
    const titleRelevance = blog.title.includes(hashtag) ? 10 : 0;
    const contentRelevance = blog.content.includes(hashtag) ? 5 : 0;
    const tagRelevance = blog.tags.includes(hashtag) ? 3 : 0;
    
    return titleRelevance + contentRelevance + tagRelevance;
}
*/
