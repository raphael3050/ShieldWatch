import express from 'express';
import { generateToken, verifyToken, verifyCredentials } from './auth.js';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from './db/model/user.js';
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
        path: '/',
        sameSite: 'None',
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

// Route pour créer un nouvel utilisateur (Signup)
router.post('/signup', [
  check('username').isString().notEmpty(),
  check('password').isString().notEmpty(),
  check('role').optional().isIn(['user', 'admin'])
], verifyToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role } = req.body;

  try {

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Créer un nouvel utilisateur
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({ 
      username, 
      password: hashedPassword, 
      role: role || 'user' 
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error('[-] Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour supprimer un utilisateur (seulement pour les admins)
router.delete('/delete/:username', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent supprimer des utilisateurs.' });
  }

  const { username } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: `Utilisateur ${username} supprimé avec succès` });
  } catch (error) {
    console.error('[-] Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour mettre à jour un utilisateur (seulement pour les admins)
router.put('/update/:username', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent mettre à jour des utilisateurs.' });
  }

  const { username } = req.params;
  const { newUsername, newPassword, newRole } = req.body;

  try {
    // Vérifier si un autre utilisateur existe déjà avec le nouveau username
    if (newUsername) {
      const usernameExists = await User.findOne({ username: newUsername });
      if (usernameExists && usernameExists.username !== username) {
        return res.status(400).json({ message: 'Le nouveau nom d\'utilisateur est déjà pris' });
      }
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updateFields = {};
    if (newUsername) updateFields.username = newUsername;
    if (newPassword) updateFields.password = bcrypt.hashSync(newPassword, 10);
    if (newRole && ['user', 'admin'].includes(newRole)) updateFields.role = newRole;

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: `Utilisateur ${username} mis à jour avec succès`, user: updatedUser });
  } catch (error) {
    console.error('[-] Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


// Route pour obtenir la liste de tous les utilisateurs (seulement pour les admins)
router.get('/users', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent voir la liste des utilisateurs.' });
  }

  try {
    const users = await User.find({}, '-password'); // Exclure le champ mot de passe des résultats
    res.status(200).json({ users });
  } catch (error) {
    console.error('[-] Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// Route pour vérifier un JWT
router.post('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token valide', user: req.user });
});

export default router;
