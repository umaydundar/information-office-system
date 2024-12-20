// /server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded.user;
    // Check if user is admin
    /*
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }*/
    console.log("passed")

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
