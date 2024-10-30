// routes/serviceRouter.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';

const router = express.Router();

// Proxy pour le service d’authentification
router.use('/log', createProxyMiddleware({
  target: 'http://logging-service:3002/log',
  changeOrigin: true,
  pathRewrite: {
    '^/log': '', 
  },
}));


// Proxy pour le service d’authentification
router.use('/notify/slack', createProxyMiddleware({
  target: 'http://notify-service:3003/notify/slack',
  changeOrigin: true,
  pathRewrite: {
    '^/log': '', 
  },
}));




module.exports = router;
