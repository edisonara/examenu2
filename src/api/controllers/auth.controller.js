import jwt from 'jsonwebtoken';
import userRepository from '../../infrastructure/repositories/user.repository.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await userRepository.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    next(error);
  }
};
