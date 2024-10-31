import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

var router = express.Router();


// Redirection des requêtes vers le endpoint de vérification de token de l'auth-service
router.get('/', createProxyMiddleware({
    target: 'http://logging-service:3003',
    pathRewrite: {
        '^': '/log',
    },
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
}));

// Redirection des requêtes vers le endpoint de suppression de log de l'auth-service
router.delete('/:id', createProxyMiddleware({
    target: 'http://logging-service:3003',
    pathRewrite: {
        '^': '/log',
    },
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
}));

router.delete('/', createProxyMiddleware({
    target: 'http://logging-service:3003',
    pathRewrite: {
        '^': '/log',
    },
    changeOrigin: true,
    on: {
        proxyReq: fixRequestBody,
    },
}));


export default router;