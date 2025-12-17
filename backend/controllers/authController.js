const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("👉 Plain password received from user:", password);

    const user = await User.findOne({ email });
    console.log("👉 Found user in DB:", user);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // console.log("👉 Hashed password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("👉 Password match?", isMatch);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
