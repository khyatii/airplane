const express = require('express');
const AuthController = require('../controllers/AuthController');
const uploadCloud = require('../config/cloudinary.js');

const router = express.Router();

router.post('/signup', AuthController.signup);

router.post('/forgotPassword', AuthController.forgotPassword);

router.post('/setPassword/:token', AuthController.setPassword);

// router.post('/confirmLogin/:token', AuthController.confirmLogin);

router.post('/checkTokenExpire/:token', AuthController.checkTokenExpire);

router.post('/checkTokenExpireLogin/:token', AuthController.checkTokenExpireLogin);

router.post('/login', AuthController.login);

router.post('/fbsignup', AuthController.fbSignup);

router.post('/googlesignup', AuthController.googleSignup);

router.get('/logout', AuthController.isAuthenticated, AuthController.logout);

router.get('/loggedin', AuthController.loggedin);

//id upload
router.post('/user/idfront', AuthController.isAuthenticated, uploadCloud, AuthController.idFrontUpload);

router.post('/user/idback', AuthController.isAuthenticated, uploadCloud, AuthController.idBackUpload);

//other user routes
router.post('/user/address', AuthController.isAuthenticated, AuthController.addressUpload);





module.exports = router;
