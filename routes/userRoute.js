const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get("/requestOTP", authController.requestOtp);
router.post("/verifyOTP", authController.verifyOtp);


router.get("/getMe", authController.protected, userController.getMe);
router.patch("/updateMe", authController.protected, userController.updateMe);
router.delete("/deleteAccount", authController.protected, userController.deleteAccount);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
;

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)
;


module.exports = router;