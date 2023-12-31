const crypto = require('crypto');
const { promisify } = require('util')
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

const signToken = (id) => {
    // takes the user id(payload), secretkey, and an option(expiredin)
  return jwt.sign({ id: id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// const sendSignUpEmailToken = async (_, user, token) => {
//     try {
      
//       // const firstName = user.fullName;
//       // const message = `
//       //   Please verify your email address\n
//       //   Click ${verificationUrl} 
//       //   \n to verify your email...`;
//       const mailMessage = confirmEmailTemplate(user.fullName, verificationUrl);
//       console.log(mailMessage);
//       await sendEmail({
//         user: user.email,
//         subject: 'Verify Your Email Address',
//         message: mailMessage
//       });
  
//     } catch (err) {
//       console.log(err);
//     }
//   };


exports.signup = async(req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            otp: generateOtp(),
        });

        if(req.params.recruitingUserId) {
            const { recruitingUserId } = req.params;
            if(!recruitingUserId) return;

            await User.findByIdAndUpdate(
                recruitingUserId,
                { $push: { invites: newUser._id } },
                { new: true }
            );
        }

        res.status(200).json({
            status: 'success',
            message: "Success!.. OTP sent to email address. Valid for 5 minutes",
            data: {
                user: newUser,
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong!'
        });
    }
}

exports.requestOtp = async(req, res) => {
    try {
        const requestingUser = await User.find({ email: req.body.email }).select('+otp');
        if(!requestingUser) return res.status(404).json({ message: 'You are not a valid user' });

        await User.findByIdAndUpdate(otpOwner._id, { otp: generateOtp() }, { useFindAndModify: false });
        
    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something Went wrong',
        });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpOwner = await User.findOne({ email }).select('+otp')
        if(Number(otpOwner.otp !== otp)) {
            console.log('otp is different')
            return res.status(400).json({ message: 'Wrong OTP' })
        }

        // Check if the OTP has expired (valid for only 5 minutes)
        if (otpOwner.otp && otpOwner.isOTPExpired()) {
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        await User.findByIdAndUpdate(otpOwner._id, { isVerified: true }, { useFindAndModify: false });
        //   otpOwner.isVerifed = true;
        //   await otpOwner.save({ validateBeforeSave: false });

        return res.status(200).json({
            status: 'success',
            message: "Registration successful! Login into Account.",
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something Went wrong',
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: 'Please provide email and password!' });
        }
        const user = await User.findOne({ email }).select('+password')
        if (!user.email  || !(await user.comparePassword(password, user.password))) {
            res.json({message: 'Incorrect email or password '})
        }
        if(!user?.active) {
          res.json({ message: 'Account no longer active' });
        }
        const token = signToken(user._id);
        // if(!user.isOTPVerified) {
        //     res.json({message: 'Email address not verified, Check your mail'})
        //     // resend otp
        //   }
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }
        res.cookie('jwt', token, cookieOptions);
        return res.status(200).json({
            status: 'success',
            message: 'Successfully Logged in!',
            data: {
                user, 
                token
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong!'
        });
    }
}

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ status: 'success' });
}


// protect 
exports.protect = catchAsync(async (req, res, next) => {
    // remember you will have to get the token from the req.header...
  // also remember that u can access the user id (payload) directly from the token, also the expired time and the issued time 

  // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.redirect('/login')
        return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_TOKEN);
    req.user = {
      id: decoded.id,
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401 )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
        new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

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


// forgot password
exports.forgotPassword = async (req, res) => {
    try {
        // 1) Get user based on POSTed email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'There is no user with email address' });
        }
    
        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
    
        // 3) Send it to user's email
        const resetURL = `${req.protocol}://${req.get(
        'host'
        )}/api/users/resetPassword/${resetToken}`;
    
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n\ If you didn't forget your password, please ignore this email!`;
    
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Your password reset token (valid for 10 min)',
        //     message
        // });
        
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'Token Email successfully sent to email!',
            emailMess: message
        });
    
    }catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message || 'There was an error sending the email. Try again later!'
        })
    }
};
  
  
// reset password
exports.resetPassword = async (req, res) => {
    try {
        // get user based on token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetEpires: { $gt: Date.now() }});
        console.log(user)
    
        // if token has not expired, there is a user, set new password
        if(!user) return res.status(404).json({ message: 'Token is invalid or has expired' });
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetEpires = undefined;
        await user.save();
    
        // update changedPasswordAt for the user
        // done in userModel on the user schema
    
        // login user, send jwt
        const token = signToken(user._id);

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }
        res.cookies('jwt', token, cookieOptions);
    
        return res.status(200).json({
            status: "success",
            data: {
                user,
            }
        })
    } catch(err) {
        return res.status(400).json({
            status: "fail",
            message: err.message || 'Something went wrong'
        })
    }
}