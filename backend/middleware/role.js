const roleCheck = (rolesAllowed) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!rolesAllowed.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of roles: ${rolesAllowed.join(', ')}` });
    }
    
    next();
  };
};

module.exports = roleCheck;
