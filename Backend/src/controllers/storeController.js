const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

// Admin: Create Store
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    if (!name || !owner_id)
      return res.status(400).json({ message: "Name and owner_id required" });

    const store = await Store.create({ name, email, address, owner_id });
    res.json(store);
  } catch (err) {
    console.error("Create store error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List Stores
exports.listStores = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (q) where.name = { [Op.like]: `%${q}%` };

    const stores = await Store.findAndCountAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    const formatted = stores.rows.map((s) => {
      const ratings = s.ratings.map((r) => r.rating);
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        avg_rating: avg,
      };
    });

    res.json({ total: stores.count, stores: formatted });
  } catch (err) {
    console.error("List stores error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get ratings for a single store
exports.getStoreRatings = async (req, res) => {
  try {
    const store_id = req.params.id;
    const ratings = await Rating.findAll({
      where: { store_id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    });
    res.json(ratings);
  } catch (err) {
    console.error("Get store ratings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
