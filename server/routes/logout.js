const express = require("express");
const router = express.Router();
const usersDB = require("../models/user");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }
  const refreshToken = cookies.jwt;

  try {
    // Is refreshToken in db?
    const foundUser = await usersDB.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = "";
    await foundUser.save();
  } catch (err) {
    return res.status(500).send(err);
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};

router.get("/", handleLogout);

module.exports = router;
