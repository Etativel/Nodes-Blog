const { authenticateToken: authenticateUser } = require("../routes/auth.js");
const {
  authenticateToken: authenticateAdmin,
} = require("../routes/adminAuth.js");

module.exports = function authenticateEither(req, res, next) {
  if (req.cookies.token) {
    return authenticateUser(req, res, next);
  }
  if (req.cookies.admintoken) {
    return authenticateAdmin(req, res, next);
  }
  return res.status(401).json({
    message: "Unauthorized: No valid token provided",
    user: { id: null },
  });
};
