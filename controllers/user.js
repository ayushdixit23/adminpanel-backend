const User = require("../models/userAuth");

exports.userbyId = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  });
};
exports.allusers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
