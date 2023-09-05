const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const userProfileController = require('../controllers/userProfileController');
const userMetricsController = require('../controllers/userMetricsController');

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
// const { requestOTP, verifyUserOTP } = require("../controller/otpController");
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


router.post('/:id/request-follow', userMetricsController.sendFollowRequest);
router.post('/accept-follow/:id', userMetricsController.acceptFollowRequest);
router.post('/reject-follow/:id', userMetricsController.rejectFollowRequest);
router.post('/:id/unfollow', userMetricsController.unFollowUser);


router.get('/:referralUrl', userMetricsController.referralInvites);

module.exports = router;