const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.post('/', auth, role('ADMIN'), storeController.createStore);
router.get('/', auth, storeController.listStores);
router.get('/:id/ratings', auth, storeController.getStoreRatings);

module.exports = router;
