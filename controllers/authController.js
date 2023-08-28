const { promisify } = require('util')
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const signToken = (id) => {
    // takes the user id(payload), secretkey, and an option(expiredin)
  return jwt.sign({ id: id }, process.env.CLUBMERCE_JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// const sendSignUpEmailToken = async (_, user, token) => {
//     try {
      
//       // const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email/${token}`;
//       const verificationUrl = `https://clubmerce.com/api/users/verify-email/${token}`;
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

/*
exports.verifyUserOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      // Check if the OTP is valid
      const otpRecord = await Otp.findOne({ otp });
      if (!otpRecord) {
        return res.status(400).send({ error: "Invalid OTP" });
      }
    
      // Check if the OTP has expired (valid for only 2 minutes)
      const otpCreatedTime = new Date(otpRecord.createdAt);
      const otpExpiryTime = otpCreatedTime.setMinutes(otpCreatedTime.getMinutes() + 2);
      if (Date.now() > otpExpiryTime) {
        return res.status(400).send({ error: "OTP expired. Please request a new one." });
      }
  
      const existingUser = await User.findOne({ email });
      const token = await jwt.sign({ id: existingUser._id, email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      // make sure user is verified
      await User.findByIdAndUpdate(existingUser._id,
        { is_verified: true }, { useFindAndModify: false });

      return res.status(201).json({
        message: "Registration successful",
        userToken: token,
      })
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: err });
    }
};

*/


exports.signup = async(req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            otp: generateOtp()
        });

        res.status(200).json({
            status: 'success',
            message: "Success!.. OTP sent to email address. Valid for 10 minutes",
            data: {
                user: newUser,
            }
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: 'Please provide email and password!' });
        }
        
        const user = await User.findOne({ email }).select('+pasword');
        if(!user || (!await user.comparePassword(password, user.password))) {
            return res.status(4040).json({
                status: 'fail',
                message: 'Email or password incorrect',
            });
        }

        const token = signToken(user._id);
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }
        res.cookie('jwt', token, cookieOptions);
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
            message: err.message
        });
    }
}

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ status: 'success' });
}


exports.protected = async (req, res, next) => {
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


// forgetten password 
// reset password
// loggedin change password


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
    
        const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
        try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
        } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    
        return res.status(200).json({
            status: 'success',
            message: 'Email successfully sent!'
        })
        }
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
  

