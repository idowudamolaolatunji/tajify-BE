const Comment = require('../../models/blogMetricsModels/commentModel');
const User = require('../../models/userModel');

// Create comments
exports.createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { blogId } = req.params
        const user = await User.findById(req.user._id)
        const newComment = await Comment.create({
            text,
            user: user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                comment: newComment,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};


exports.getAllBlogComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        if(!blog) return res.json({ message: 'Provide blog id' })
        const comments = await Comment.find({ blog: blogId });

        res.status(200).json({
            status: 'success',
            data: {
                comment: comments
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
}


exports.updateBlogComment = async (req, res) => {
    try {
        const { commentId, blogId} = req.params;
        const user = await User.findById(req.user._id);
        const updatedComment = await Comment.findOneAndUpdate({ _id: commentId , user: user._id, blog: blogId }, req.body, {
            new: true,
            runValidation: true,
        });

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
            data: {
                comment: updatedComment
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};


exports.deleteBlogComment = async (req, res) => {
    try {
        const { commentId, blogId} = req.params;
        const user = await User.findById(req.user._id);
        await Comment.findOneAndDelete({
            _id: commentId,
            user: user._id,
            blog: blogId,
        });

        res.status(204).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};
