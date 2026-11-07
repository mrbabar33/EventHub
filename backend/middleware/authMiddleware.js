const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Pehle login karo' });
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User nahi mila' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expire ho gaya, dobara login karo' });
  }
}

module.exports = { protect };