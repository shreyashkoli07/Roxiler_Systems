const { User } = require('../../index');   
const { hashPassword } = require('../utils/hash');


// logged-in user profile

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "address", "role"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Update Profile (name, address, password)

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, password } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    // VALIDATIONS
    

    if (name && name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    if (password) {
      const strongPass = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;
      if (!strongPass.test(password)) {
        return res.status(400).json({
          message:
            "Password must be 8–16 chars with at least one uppercase and one special character"
        });
      }
    }

    
    // APPLY UPDATES
 
    if (name) user.name = name;
    if (address) user.address = address;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    // Return updated data
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "address", "role"]
    });

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
