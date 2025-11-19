const { Store, Rating, User } = require('../index');  // UPDATED PATH
const { Op } = require('sequelize');

// --------------------- CREATE STORE ---------------------
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !owner_id) {
      return res.status(400).json({
        message: "Name and owner_id are required",
      });
    }

    // Optional: email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid store email" });
    }

    const store = await Store.create({ name, email, address, owner_id });

    return res.json({
      message: "Store created successfully",
      store,
    });

  } catch (err) {
    console.error("Create store error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------- LIST STORES ---------------------
exports.listStores = async (req, res) => {
  try {
    let { q = '', page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const where = {};
    if (q) {
      where.name = { [Op.like]: `%${q}%` };
    }

    // Allow only safe sorting fields
    const allowedSort = ['name', 'email', 'createdAt'];
    if (!allowedSort.includes(sortBy)) sortBy = 'name';

    order = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAndCountAll({
      where,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset: (page - 1) * limit,
    });

    // Reformat response with average ratings
    const formatted = stores.rows.map((store) => {
      const ratings = store.ratings || [];
      const ratingValues = ratings.map(r => Number(r.rating) || 0);

      const avg =
        ratingValues.length > 0
          ? (ratingValues.reduce((sum, n) => sum + n, 0) / ratingValues.length).toFixed(2)
          : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner ? {
          id: store.owner.id,
          name: store.owner.name,
          email: store.owner.email
        } : null,
        average_rating: avg,
        total_ratings: ratingValues.length,
      };
    });

    return res.json({
      total: stores.count,
      page,
      limit,
      stores: formatted,
    });

  } catch (err) {
    console.error("List stores error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------- STORE: GET ALL RATINGS ---------------------
exports.getStoreRatings = async (req, res) => {
  try {
    const store_id = Number(req.params.id);

    if (!store_id) {
      return res.status(400).json({ message: "Invalid store id" });
    }

    const ratings = await Rating.findAll({
      where: { store_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formatted = ratings.map(r => ({
      id: r.id,
      rating: Number(r.rating) || 0,
      comment: r.comment || "",
      user: r.user ? {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email
      } : null,
      created_at: r.createdAt
    }));

    return res.json({ ratings: formatted });

  } catch (err) {
    console.error("Get store ratings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
