const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.signup = async(req, res) => {
    try {
        const newUser = await User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
            passwordConfrim: req.body.passwordConfirm,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.status(200).json({
            status: 'success',
            data: {
                user: newUser,
                token
            }
        })

    } catch(err) {

    }
}