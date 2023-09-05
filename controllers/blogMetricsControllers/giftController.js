
exports.sendGift = async (req, res) => {
    try {
        const { type, recipientId } = req.body;
        const newGift = await Gift.create({
            type,
            sender: req.user._id,
            recipient: recipientId,
        });

        res.status(201).json({
            status: 'success',
            data: {
                gift: newGift,
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong',
        });
    }
};

