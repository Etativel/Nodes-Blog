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
        const normalizedCredential = credential.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;
        if (emailRegex.test(normalizedCredential)) {
          user = await userService.getUserByEmail(normalizedCredential);
        } else {
          user = await userService.getUserByUsername(normalizedCredential);
        }

        if (!user) {
          if (emailRegex.test(normalizedCredential)) {
            return cb(null, false, { message: "Email not registered." });
          } else {
            return cb(null, false, {
              message: "Username not registered.",
            });
          }
        }
        if (user.role !== "ADMIN") {
          return cb(null, false, {
            message:
              "Access Denied: Your account does not have administrative privileges. Please contact support if you believe this is an error.",
          });
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
