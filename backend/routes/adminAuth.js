require("dotenv").config({ path: "../.env" });
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Authentication middleware to verify JWT from httpOnly cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.admintoken;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      user: {
        id: null,
      },
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

function isAdmin(req, res, next) {
  // allow both ADMIN and SUPERUSER
  console.log("This is user role", req.user?.role);
  if (req.user?.role === "ADMIN" || req.user?.role === "SUPERADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Admins only" });
}

function isSuperAdmin(req, res, next) {
  if (req.user?.role === "SUPERADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Superusers only" });
}

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "admin-local",
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info && info.message ? info.message : "Bad request",
          user: user,
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.cookie("admintoken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          // maxAge: 30000,
        });
        return res.json({ user });
      });
    }
  )(req, res);
});

router.post("/logout", (req, res) => {
  res.clearCookie("admintoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { router, authenticateToken, isAdmin, isSuperAdmin };
