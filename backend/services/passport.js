require("dotenv").config({ path: "../.env" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userService = require("./userService");
const bcrypt = require("bcryptjs");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "credential",
      passwordField: "password",
    },
    async function (credential, password, cb) {
      try {
        const normalizedUsername = credential.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;
        if (emailRegex.test(normalizedUsername)) {
          user = await userService.getUserByEmail(normalizedUsername);
        } else {
          user = await userService.getUserByUsername(normalizedUsername);
        }

        if (!user) {
          return cb(null, false, { message: "No username found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, cb) => {
      return userService
        .getUserById(jwtPayload.id)
        .then((user) => (user ? cb(null, user) : cb(null, false)))
        .catch((err) => cb(err, false));
    }
  )
);
