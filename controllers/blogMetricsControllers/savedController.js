exports.savePost = async (req, res) => {
    try {
        const { blogId } = req.body;
        const newSaved = await Saved.create({
            user: req.user._id,
            blog: blogId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                saved: newSaved,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};



exports.unsavePost = async (req, res) => {
    try {
        const { blogId } = req.body;
        await Saved.findOneAndDelete({
            user: req.user._id,
            blog: blogId,
        });

        res.status(200).json({
            status: 'success',
            message: 'Post unsaved successfully',
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};
