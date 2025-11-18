const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Admin routes
router.get('/dashboard', auth, role('ADMIN'), adminController.dashboard);
router.get('/users', auth, role('ADMIN'), adminController.listUsers);
router.post('/users', auth, role('ADMIN'), adminController.createUser);

module.exports = router;
