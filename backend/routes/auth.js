require("dotenv").config({ path: "../.env" });
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Authentication middleware to verify JWT from httpOnly cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

router.post("/login", (req, res, next) => {
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
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });
      return res.json({ user });
    });
  })(req, res);
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
