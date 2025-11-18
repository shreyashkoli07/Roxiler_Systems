const { User } = require('../models');
const { hashPassword } = require('../utils/hash');

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "address", "role"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile + password
exports.updateProfile = async (req, res) => {
  try {
    const { name, address, password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (address) user.address = address;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
