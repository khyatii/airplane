const express = require('express');
const ClaimController = require('../controllers/ClaimController');
const AuthController = require('../controllers/AuthController');
const uploadCloud = require('../config/cloudinary.js');

const router = express.Router();

//ALL WITH /claim BEFORE
router.post('/new', AuthController.isAuthenticated, ClaimController.new);
router.post('/calculate', ClaimController.calculate);
router.post('/update', AuthController.isAuthenticated, ClaimController.update);
router.get('/userlist', AuthController.isAuthenticated, ClaimController.userList);
router.post('/findbyid', AuthController.isAuthenticated, ClaimController.findById);

//files
// upload.single('file') this is for ng2 upload

router.post('/companyclaim', AuthController.isAuthenticated, uploadCloud, ClaimController.companyClaim);
router.post('/reservationorticket', AuthController.isAuthenticated, uploadCloud, ClaimController.reservationOrTicket);
router.post('/boardingpass', AuthController.isAuthenticated, uploadCloud, ClaimController.boardingPass);





module.exports = router;
