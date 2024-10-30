import express from 'express';
import { adminUser, generateToken, verifyToken, verifyCredentials } from './auth.js';

var router = express.Router();

// Route pour se connecter
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vérifier le nom d'utilisateur et le mot de passe
    if (verifyCredentials(username, password)) {
        const token = generateToken(adminUser);
        res.json({ message: 'Authentifié avec succès', token });
    } else {
        res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });
    }
});

router.post('/verify', verifyToken, (req, res) => {
    res.json({ message: 'Token valide', user: req.user });
}); 

export default router;
