const express = require('express');
const AirlineController = require('../controllers/AirlineController');

const router = express.Router();

//'/airline before'
router.post('/autocomplete', AirlineController.autocomplete);
router.post('/find', AirlineController.find);

module.exports = router;
