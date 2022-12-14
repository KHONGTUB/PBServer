const User = require("../models/users");
const record = require("../models/userRecord");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv/config");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, result) => {
    if (err) return res.sendStatus(403);

    next();
  });
}

function generateToken(user) {
  return jwt.sign(user, process.env.SECRET);
}

async function getall(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function signup(req, res) {
  const { username, password } = req.body;
  const users = await User.find({ username: req.body.username });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: username,
    password: hashedPassword,
  });
  if (users.length === 0) {
    try {
      const newUser = await user.save();
      const rec = new record({
        user_id: newUser._id,
        records: [],
      });
      const newrecord = await rec.save();
      res.status(201).json({ new: newUser, newrecord });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.json({ message: "Username is Taken" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const users = await User.findOne({ username: req.body.username });
  if (users != null) {
    const match = await bcrypt.compare(password, users.password);
    if (match) {
      const token = generateToken({ username, password });
      res.json({
        token: token,
        userId: users._id,
      });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
}

module.exports = { login, signup, getall, authenticateToken };
