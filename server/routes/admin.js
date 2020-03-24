const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

//admin before
router.get('/users/list', AdminController.isAdmin, AdminController.listUser);
router.get('/claim/list', AdminController.isAdmin, AdminController.listClaim);
router.post('/claim/status', AdminController.isAdmin, AdminController.updateStatus);
router.post('/claim/delete',
// AdminController.isAdmin,
AdminController.deleteClaim);

module.exports = router;
