const jwt = require("jsonwebtoken");
const { read } = require("../helpers/fileHelper");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const users = read("users.json");
  const user = users.find((u) => u.id === decoded.id);
  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

module.exports = { protect, adminOnly };
