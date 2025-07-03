const superadminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmins only.' });
    }
    next();
  };
  
  module.exports = superadminMiddleware;
  