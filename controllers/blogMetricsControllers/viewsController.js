// controllers/viewController.js
const View = require('../models/viewModel');

exports.recordView = async (req, res) => {
    try {
        const { blogId } = req.body;

        // Simulate a delay of 30 seconds (for demonstration purposes)
        await new Promise(resolve => setTimeout(resolve, 30000));

        const newView = await View.create({
            user: req.user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                view: newView,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};
