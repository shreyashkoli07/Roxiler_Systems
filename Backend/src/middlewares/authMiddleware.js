const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ message: 'Missing token' });

  const token = auth.split(' ')[1];
  
  try {
    const payload = verify(token);
    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
