const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            data: {
                count: users.length,
                users
            }
        });
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};

exports.getUser = async(req, res) => {
    try {
        const { slug } = req.params;
        const user = await User.findOne({ slug });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead',
    });
    // return res.redirect('/signup')
};

exports.updateUser = async(req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser,
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};

exports.deleteUser = async(req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err || 'Something went wrong'
        });
    }
};



exports.getMe = (req, res, next) => {
    // this middleware gives us access to the current user
    req.params.id = req.user._id;
    next();
};


// delete current user
exports.deleteAccount = async(req, res, next) => {
    try {
        // get user
        await User.findByIdAndUpdate(req.user._id, { active: false });

        res.cookie('jwt', '', {
            expires: new Date(Date.now() + 10 * 500),
            httpOnly: true
          }).clearCookie('jwt')
        return res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err) {
    console.log(err)
    }
};




////////////////////////////////////
////////////////////////////////////
////////////////////////////////////
////////////////////////////////////

// Send a follow request
exports.sendFollowRequest = async (req, res) => {
    try {
        const currentUser = await User.findOne({ user: req.user._id });
        const userToFollow = await User.findById(req.params.id);

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
        const currentUser = await User.findOne({ user: req.user._id });
        const userToAccept = await User.findById(req.params.id);

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
        const currentUser = await User.findOne({ user: req.user._id });
        const userToReject = await User.findById(req.params.id);
    
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
        const currentUser = await User.findOne({ user: req.user._id });
        const userToUnfollow = await User.findById(req.params.id);
  
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

        await User.findOneAndUpdate({ user: recruitingUser._id }, { $inc: { referalsCount } }, { new: true } );

    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message || 'An error occured!'
        })
    }
}