import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import passport from 'passport';

const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error en autenticación JWT:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (!user) {
      return res.status(401).json({ 
        message: info ? info.message : 'Not authorized, invalid token' 
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

export default protect;
