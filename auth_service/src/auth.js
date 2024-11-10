import jwt from 'jsonwebtoken';
import User from './db/model/user.js';

// Fonction pour générer un token JWT
export function generateToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

// Middleware pour vérifier le token
export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'Token requis' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });

    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
    req.user = decoded;
    next();
  });
}

// Vérifier les identifiants de connexion
export async function verifyCredentials(username, password) {
  const user = await User.findOne({ username });
  if (user && user.comparePassword(password)) {
    return user;
  }
  return null;
}
