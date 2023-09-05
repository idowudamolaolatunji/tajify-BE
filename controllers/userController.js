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