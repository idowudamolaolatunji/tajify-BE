const { promisify } = require('util')
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
        
        const user = await User.findOne(email).select('+pasword');
        if(!user || (!await user.comparePassword(password, user.password))) {
            return res.status(4040).json({
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

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ status: 'success' });
}


exports.prodected = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token;  
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if(req.cookies.jwt) {            
            token = req.cookies.jwt
        }

        // 2) Verification token, and set req user
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_TOKEN);
        req.user = {
            id: decoded.id,
        }

        // 3) find / Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            res.status(401).json({ message: 'The user belonging to this token does no longer exist!' });
            return next();
        }

        // 4) Check if user changed password after the token was issued
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            res.status(401).json({ message: 'User recently changed password! Please login with changed password!.' });
            return next()
        }

        req.user = currentUser;
        res.locals.user = currentUser;

        next()
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err
        });
    }
    next();
}

exports.isLoggedIn = async(req, res, next) => {
    if(req.cookies.jwt) {
        try{
            // verify / decode token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET_TOKEN)

            // find / check if user still exist
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) {
                return next();
            }

            // check if password was changed after token was created
            if(currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            req.user = currentUser;
            res.locals.user = currentUser;
            next();
        } catch(err) {
            return next();
        }
    }
    // no token found
    next();
}

// exports

// forgetten password 
// reset password
// loggedin change password

