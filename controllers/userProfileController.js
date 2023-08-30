const UserProfile = require('../models/userProfileModel');

// update current user data
exports.updateMyProfile = async (req, res) => {
    try {
        // create an error if user POST's password data.
        if(req.body.password || req.body.passwordConfirm) {
            return res.status(404).json({ message: 'This route is not for password updates. Please use /updateMyPassword.' });
        }
        // 2. update
        const updatedUser = await UserProfile.findByIdAndUpdate({ user: req.user.id}, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                user: updatedUser
            }
        })
    } catch(err) {
        res.status(200).json({
            status: "fail",
            message: err.message || 'Something went wrong!'
        })
    }
};