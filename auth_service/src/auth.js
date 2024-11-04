import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

if (!process.env.ADMIN_LOGIN || !process.env.ADMIN_PASSWORD) {
    console.error('[-] Définissez les variables d\'environnement ADMIN_LOGIN et ADMIN_PASSWORD dans le fichier .env');
    process.exit(1);
}

export const adminUser = {
    // ************************* ATTENTION ******************************************
    // Il faut idéalement stocker ces informations dans une base de données sécurisée,
    // Pour simplifier, nous les stockons dans un fichier .env que vous devrez créer et remplir
    // ************************* ATTENTION ******************************************

    username: process.env.ADMIN_LOGIN,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
};

// Fonction pour générer un token JWT
export function generateToken(user) {
    return jwt.sign({ username: user.username, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
}

// Middleware pour vérifier le token
export function verifyToken(req, res, next) {
    // Récupérer le token depuis les cookies
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'Token requis' });

    // Vérifier la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token Invalide" });

        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
        req.user = decoded;
        next();
    });
}




export function verifyCredentials(username, password) {
    return username === adminUser.username && bcrypt.compareSync(password, adminUser.password);
}