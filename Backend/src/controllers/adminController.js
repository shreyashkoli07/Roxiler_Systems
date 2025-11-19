const { User, Store, Rating } = require('../../index.js');   // FIXED PATH
const { Op } = require('sequelize');
const { hashPassword } = require('../utils/hash');

// ======================
// Admin Dashboard Counts
// ======================
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================================
// Admin: List Users with Filters + Pagination + Sorting
// =======================================================
exports.listUsers = async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { address: { [Op.like]: `%${q}%` } }
      ];
    }

    if (role) where.role = role;

    const users = await User.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({ total: users.count, users: users.rows });

  } catch (err) {
    console.error("List Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================================
// Admin: Create a User (Admin, Store Owner, or Normal User)
// =======================================================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Validations
    if (!name || name.length < 20 || name.length > 60)
      return res.status(422).json({ message: "Name must be 20–60 characters" });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(422).json({ message: "Invalid email format" });

    if (!password || !/^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/.test(password))
      return res.status(422).json({
        message: "Password must be 8–16 chars with uppercase & special char"
      });

    const allowedRoles = ["ADMIN", "USER", "STORE_OWNER"];
    const finalRole = allowedRoles.includes(role) ? role : "USER";

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role: finalRole
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    });

  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
