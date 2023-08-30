

// const Comment = require('../models/commentModel');

// Create comments
exports.createComment = async (req, res) => {
    try {
        const { text, blogId } = req.body;
        const newComment = await Comment.create({
            text,
            user: req.user._id,
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


// controllers/commentController.js
// const Comment = require('../models/commentModel');

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const updatedComment = await Comment.findOneAndUpdate({ _id: commentId , user: req.user._id }, req.body, {
            new: true,
            runValidation: true,
        });

        res.status(200).json({
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

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        await Comment.findOneAndDelete({
            _id: commentId,
            user: req.user._id,
        });

        res.status(200).json({
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
