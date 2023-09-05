const UserMetrics = require('../models/userMetricsModel');
const User = require('../models/userModel');


// Send a follow request
exports.sendFollowRequest = async (req, res) => {
    try {
        const currentUser = await UserMetrics.findOne({ user: req.user._id });
        const userToFollow = await UserMetrics.findById(req.params.id);

        if (!currentUser.followerRequestsSent.includes(userToFollow._id)) {
            userToFollow.followerRequestsReceived.push(currentUser._id);
            await userToFollow.save({ validateBeforeSave: false });

            currentUser.followerRequestsSent.push(userToFollow._id);
            await currentUser.save({ validateBeforeSave: false });

            res.status(200).json({ message: 'Follow request sent successfully' });
        } else {
            res.status(400).json({ message: 'Follow request already sent' });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'An error occurred'
        });
    }
};


// Accept a follow request
exports.acceptFollowRequest = async (req, res) => {
    try {
        const currentUser = await UserMetrics.findOne({ user: req.user._id });
        const userToAccept = await UserMetrics.findById(req.params.id);

        if (currentUser.followerRequestsReceived.includes(userToAccept._id)) {
            // Update following for the current user
            currentUser.following.push(userToAccept._id);
            await currentUser.save({ validateBeforeSave: false });

            userToAccept.followers.push(currentUser._id);
            await userToAccept.save({ validateBeforeSave: false });

            // Remove from receiver's followerRequestsReceived and sender's followerRequestsSent
            currentUser.followerRequestsReceived.pull(userToAccept._id);
            userToAccept.followerRequestsSent.pull(currentUser._id);
            await currentUser.save({ validateBeforeSave: false });
            await userToAccept.save({ validateBeforeSave: false });

            res.status(200).json({ message: 'Follow request accepted' });
        } else {
            res.status(400).json({ message: 'No follow request received from this user' });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'An error occurred'
        });
    }
};


// Reject a follow request
exports.rejectFollowRequest = async (req, res) => {
    try {
        const currentUser = await UserMetrics.findOne({ user: req.user._id });
        const userToReject = await UserMetrics.findById(req.params.id);
    
        if (currentUser.followerRequestsReceived.includes(userToReject._id)) {
            currentUser.followerRequestsReceived.pull(userToReject);
            userToReject.followerRequestsSent.pull(currentUser);
  
            await currentUser.save({ validateBeforeSave: false });
            await userToReject.save({ validateBeforeSave: false });
    
            res.status(200).json({ message: 'Follow request rejected' });
        } else {
            res.status(400).json({ message: 'No follow request received from this user' });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'An error occurred'
        });
    }
};


// Unfollow a user
exports.unFollowUser = async (req, res) => {
    try {
        const currentUser = await UserMetrics.findOne({ user: req.user._id });
        const userToUnfollow = await UserMetrics.findById(req.params.id);
  
        if (currentUser.following.includes(userToUnfollow._id)) {
            currentUser.following.pull(userToUnfollow._id);
            userToUnfollow.followers.pull(currentUser._id);
    
            await currentUser.save({ validateBeforeSave: false });
            await userToUnfollow.save({ validateBeforeSave: false });
    
            res.status(200).json({ message: 'Unfollowed successfully' });
        } else {
            res.status(400).json({ message: 'Not following this user' });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'An error occurred'
        });
    }
};


// invites
exports.referralInvites = async (req, res) => {
    try {
        const { referralUrl } = req.params;
        const recruitingUser = User.findOne({ referralUrl });
        if(!recruitingUser) {
            res.status(404).json({ message: 'user with this invite id no longer exist'});
        }
        // Redirect to Tajify homepage
        res.redirect('https://www.tajify.com/');

        setTimeout(() => {
            // Redirect to signup page after 2 minute
            res.redirect(`https://www.tajify.com/signup/${recruitingUser._id}`);
        }, 120000);

        await UserMetrics.findOneAndUpdate({ user: recruitingUser._id }, { $inc: { referalsCount } }, { new: true } );

    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message || 'An error occured!'
        })
    }
}