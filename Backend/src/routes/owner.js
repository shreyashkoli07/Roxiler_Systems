const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const auth = require('../middlewares/authMiddleware');

// Only owner or admin
router.get('/:ownerId/ratings', auth, (req, res, next) => {
  const userRole = req.user.role;
  const userId = req.user.id;
  const ownerId = Number(req.params.ownerId);

  if (userRole === 'ADMIN') return next();

  if (userRole === 'STORE_OWNER') {
    if (userId !== ownerId)
      return res.status(403).json({ message: 'Forbidden' });
    return next();
  }

  return res.status(403).json({ message: 'Forbidden' });
}, ownerController.getOwnerRatings);

module.exports = router;
