
// Create share
// const Share = require('../models/shareModel');

exports.sharePost = async (req, res) => {
    try {
        const { blogId } = req.body;
        const newShare = await Share.create({
            user: req.user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                share: newShare,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};