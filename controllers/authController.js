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
            message: 'Signed up successfully!',
            data: {
                user: newUser,
                token
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: 'Please provide email and password!' });
        }
        
        const user = await User.findOne(email).select('-pasword');
        if(!user || (!await user.comparePassword(password, user.password))) {
            return res.status(200).json({
                status: 'fail',
                message: 'Email or password incorrect',
            });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        })
        res.status(200).json({
            status: 'success',
            data: {
                user, 
                token
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

require('express')().use( async (req, res, next) => {
    try {
        let token;
        // if(req.)

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err
        });
    }
    next();
})