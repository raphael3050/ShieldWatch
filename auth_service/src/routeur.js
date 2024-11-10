import express from 'express';
import { generateToken, verifyToken, verifyCredentials } from './auth.js';
import { check, validationResult } from 'express-validator';
const router = express.Router();

// Route pour se connecter
router.post('/login', [
  check('username').isString().notEmpty(),
  check('password').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Vérifier les identifiants avec MongoDB
    const user = await verifyCredentials(username, password);
    if (user) {
      const token = generateToken(user);
      console.log(`[+] Token généré pour ${username}`);

      // Configuration du cookie HttpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // doit être true en production (HTTPS)
        sameSite: 'none',
        maxAge: 3600000,
    });
      return res.status(200).json({ message: 'Authentifié avec succès', token });
    } else {
      return res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('[-] Erreur lors de la connexion:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour vérifier un JWT
router.post('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token valide', user: req.user });
});

export default router;
