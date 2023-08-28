const _ = require("lodash");
const otpGenerator = require("otp-generator");
const jwt = require('jsonwebtoken');
const  { User }  = require("../models/otpModel");
const { Otp } = require("../model/otpModel");

// Generates a random 6 digit phone for OTP.
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

module.exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
      // check if phone number exist
    const user = await User.findOne({ email });
    if (user) {
      const otp = generateOtp();
      Otp.create({ otp, userId: user._id });
      return res.status(201).json({ 
        message: "OTP sent. Valid for only 10 minutes", otp
      });
    } else {
      return res.status(201).json({ message: 'User not registered' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "An error occured" })
  }
}


module.exports.verifyUserOTP = async (req, res) => {
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
