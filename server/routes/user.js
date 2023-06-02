const express = require("express");
const router = express.Router();
const usersDB = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  return res.send(req.user);
});

router.put("/", async (req, res) => {
  console.log("pwchang");
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res
      .status(400)
      .json({ message: "New and old passwords are required." });
  try {
    const foundUser = await usersDB.findOne({ where: { username: req.user } });
    if (!foundUser) {
      return res.sendStatus(401); // Unauthorized
    }
    // evaluate password
    const match = await bcrypt.compare(oldPassword, foundUser.password);
    if (match) {
      const hashedPwd = await bcrypt.hash(newPassword, 10);
      foundUser.password = hashedPwd;
      await foundUser.save();
      return res.sendStatus(204);
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
