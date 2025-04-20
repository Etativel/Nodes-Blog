require("dotenv").config({ path: "../.env" });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const userService = require("./userService");

async function checkActiveSuspension(userId) {
  return prisma.suspension.findFirst({
    where: {
      userId,
      liftedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
  });
}

passport.use(
  "user-local",
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
            return cb(null, false, { message: "Username not registered." });
          }
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }

        const activeSuspension = await checkActiveSuspension(user.id);
        console.log(activeSuspension);
        if (activeSuspension) {
          return cb(null, false, {
            message: `Your account has been suspended until ${
              activeSuspension.expiresAt
                ? activeSuspension.expiresAt.toISOString()
                : "further notice"
            }`,
          });
        }

        if (activeSuspension) {
          console.log("User is suspended:", activeSuspension);
        }
        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.use(
  "admin-local",
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
        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
          return cb(null, false, {
            message:
              "Access Denied: Your account does not have administrative privileges. Please contact support if you believe this is an error.",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }

        const activeSuspension = await checkActiveSuspension(user.id);
        console.log(activeSuspension);
        if (activeSuspension) {
          return cb(null, false, {
            message: `Your account has been suspended until ${
              activeSuspension.expiresAt
                ? activeSuspension.expiresAt.toISOString()
                : "further notice"
            }`,
          });
        }

        if (activeSuspension) {
          console.log("User is suspended:", activeSuspension);
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, cb) => {
      try {
        const user = await userService.getUserById(payload.id);
        return cb(null, user || false);
      } catch (err) {
        return cb(err, false);
      }
    }
  )
);
