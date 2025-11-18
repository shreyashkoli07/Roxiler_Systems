const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middlewares/authMiddleware');
const { ratingValidation } = require('../utils/validators');
const validate = require('../middlewares/validationMiddleware');

router.post('/', auth, ratingValidation, validate, ratingController.submitOrUpdateRating);

module.exports = router;
