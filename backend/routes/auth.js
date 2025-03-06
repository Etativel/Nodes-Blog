require("dotenv").config({ path: "../.env" });
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Bad request",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
