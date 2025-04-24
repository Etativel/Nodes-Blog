async function isProfileOwner(req, res, next) {
  const authenticatedUserId = req.user.id;
  const userId = req.params.userId;

  try {
    if (authenticatedUserId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this profile" });
    }
    next();
  } catch (err) {
    console.error("Error in isProfileOwner middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { isProfileOwner };
