const express = require('express');
const AirportController = require('../controllers/AirportController');

const router = express.Router();

//'/airport before'
router.post('/autocomplete', AirportController.autocomplete);
router.post('/find', AirportController.find);


module.exports = router;
