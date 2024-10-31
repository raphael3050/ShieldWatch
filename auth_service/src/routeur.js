import express from 'express';
import { adminUser, generateToken, verifyToken, verifyCredentials } from './auth.js';
import { check, validationResult } from 'express-validator';
var router = express.Router();

// Route pour se connecter
router.post('/login', [
    check('username').isString().notEmpty(),
    check('password').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log(`[+] POST /auth/login ${username} ${password}`);

    if (verifyCredentials(username, password)) {
        const token = generateToken(adminUser);
        console.log(`[+] Token généré pour ${username}`);
        res.status(200).json({ message: 'Authentifié avec succès', token });
    } else {
        res.status(401).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });
    }
});

router.post('/verify', verifyToken, (req, res) => {
    res.json({ message: 'Token valide', user: req.user });
});

export default router;
