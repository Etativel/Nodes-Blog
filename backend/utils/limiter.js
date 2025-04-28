const rateLimit = require("express-rate-limit");

const createLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  message = "Too many requests from this IP, please try again later.",
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = createLimiter;
