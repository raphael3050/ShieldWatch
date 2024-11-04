import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

var router = express.Router();


// Redirection des requêtes vers le endpoint de vérification de token de l'auth-service
router.get('/status', createProxyMiddleware({
    target: 'http://threat-detection-service:3000',
    pathRewrite: {
        '^/status': '/monitor/status',
    },
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
}));



export default router;