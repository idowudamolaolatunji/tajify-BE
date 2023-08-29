// controllers/impressionController.js
const Impression = require('../models/impressionModel');

exports.createImpression = async (req, res) => {
    try {
        const { blogId } = req.body;
        await Impression.create({
            user: req.user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            message: 'Impression created successfully',
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};
