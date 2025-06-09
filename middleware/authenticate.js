const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Try to get token from Authorization header (Bearer) or from cookie
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_CODE || 'your_jwt_secret_key');
    req.user = decoded; // Will now have userId, email, and name
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
