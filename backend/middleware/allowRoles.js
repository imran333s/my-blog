// middleware/allowRoles.js
const allowRoles = (...roles) => {
  const allowed = roles.map((r) => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Login required" });
    }

    const userRole = req.user.role.toLowerCase();

    if (!allowed.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient role" });
    }

    next();
  };
};

module.exports = allowRoles;
