const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.get('Authorization');
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.get('Authorization');
  const token = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // proceed without user attached if token invalid
  }
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
}

module.exports = { requireAuth, optionalAuth, requireRole };

