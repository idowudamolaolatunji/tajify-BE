
// const Like = require('../models/likeModel');
// Create likes
exports.likePost = async (req, res) => {
    try {
        const { blogId } = req.body;
        const newLike = await Like.create({
            user: req.user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                like: newLike,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};


// const Unlike = require('../models/unlikeModel');

exports.unlikePost = async (req, res) => {
    try {
        const { blogId } = req.body;
        await Unlike.findOneAndDelete({
            user: req.user._id,
            blog: blogId,
        });

        res.status(200).json({
            status: 'success',
            message: 'Post unliked successfully',
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};
