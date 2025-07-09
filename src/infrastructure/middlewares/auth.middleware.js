import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user._id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token failed' });
  }
};

export default protect;
