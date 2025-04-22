function authorizeUser(req, res, next) {
  const authenticatedUserId = req.user.id;
  const targetUserId = req.params.userId;

  if (authenticatedUserId !== targetUserId) {
    return res.status(403).json({ message: "Forbidden: Not your account" });
  }

  next();
}

module.exports = { authorizeUser };
