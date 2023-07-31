
const Blog = require('../models/blogModel');

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
        const userId = req.user._id;
        const newBlog = await Blog.create({ ...req.body, userId });
        
        res.status(201).json({
            status: 'success',
            data: {
                blog: newBlog
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};

// Get Blogs for User
exports.getUserBlogs = async(req, res) => {
    try {
        const userId = req.user._id;
        const userBlogs = await Blog.find({ user: userId });

        res.status(200).json({
            status: 'success',
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
exports.getBlogsByUserId = async(req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const userBlogs = await Blog.find(requestedUserId);
        res.status(200).json({
            status: 'success',
            data: {
                count: userBlogs.length,
                blogs: userBlogs
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
exports.getOneBlogByUserId = async(req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const userBlogs = await Blog.find(requestedUserId);
        // const blog = userBlogs.map(el => el._id === req.params.id);
        const blog = userBlogs.find(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                // ...blog
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