const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userProfileController = require('../controllers/userProfileController');
// const { requestOTP, verifyUserOTP } = require("../controller/otpController");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signup/:recruitingUserId', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/requestOTP", authController.requestOtp);
router.post("/verifyOTP", authController.verifyOtp);

// // OTP
// router.post("/verify", verifyUserOTP);
// router.post("/request", requestOTP);i

router.get("/getMe", authController.protect, userController.getMe);
router.delete("/deleteAccount", authController.protect, userController.deleteAccount);

router.patch("/updateMyProflie", authController.protect, userProfileController.updateMyProfile);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
;

router.route('/:slug')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
;


router.post('/:id/request-follow', userController.sendFollowRequest);
router.post('/accept-follow/:id', userController.acceptFollowRequest);
router.post('/reject-follow/:id', userController.rejectFollowRequest);
router.post('/:id/unfollow', userController.unFollowUser);


router.get('/:referralUrl', userController.referralInvites);

module.exports = router;