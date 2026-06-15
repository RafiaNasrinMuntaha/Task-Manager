const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { read, write } = require("../helpers/fileHelper");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const users = read("users.json");

  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    role: role === "admin" ? "admin" : "user",
  };

  users.push(newUser);
  write("users.json", users);

  const { password: _, ...userWithoutPassword } = newUser;
  res
    .status(201)
    .json({ token: generateToken(newUser.id), user: userWithoutPassword });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const users = read("users.json");
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ token: generateToken(user.id), user: userWithoutPassword });
};
