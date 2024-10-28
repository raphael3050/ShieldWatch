// routes/serviceRouter.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const router = express.Router();

// Proxy pour le service d’authentification
router.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001', // URL de votre service d'authentification
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // Réécrire le chemin pour correspondre aux routes du service
  },
}));

// Proxy pour le service de notifications
router.use('/notifications', createProxyMiddleware({
  target: 'http://notification-service:3002', // URL de votre service de notifications
  changeOrigin: true,
  pathRewrite: {
    '^/notifications': '', // Réécrire le chemin
  },
}));

// Proxy pour d’autres services...
router.use('/data', createProxyMiddleware({
  target: 'http://data-service:3003', // URL de votre service de données
  changeOrigin: true,
  pathRewrite: {
    '^/data': '', // Réécrire le chemin
  },
}));

module.exports = router;
