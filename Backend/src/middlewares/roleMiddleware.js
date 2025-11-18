module.exports = (allowed) => (req, res, next) => {
  const role = req.user.role;

  if (Array.isArray(allowed)) {
    if (allowed.includes(role)) return next();
  } else {
    if (role === allowed) return next();
  }

  return res.status(403).json({ message: 'Forbidden' });
};
