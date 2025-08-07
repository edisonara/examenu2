import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

/**
 * Genera un token JWT para el usuario
 * @param {string} userId - ID del usuario
 * @returns {string} Token JWT
 */
export const generateToken = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to generate token');
  }
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {object|null} Objeto decodificado o null si el token es inválido
 */
export const verifyToken = (token) => {
  if (!token) {
    return null;
  }
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return null;
  }
};

// Exportar funciones individuales y como objeto
export default {
  generateToken,
  verifyToken
};
