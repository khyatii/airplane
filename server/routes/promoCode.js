const express = require('express');
const PromoCodeController = require('../controllers/PromoCodeController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

//ALL WITH /promocode BEFORE
router.post('/checkpromocode', AuthController.isAuthenticated, PromoCodeController.checkPromoCode);
router.get('/listuser', AuthController.isAuthenticated, PromoCodeController.listUser);


module.exports = router;
