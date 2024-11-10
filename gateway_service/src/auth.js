import express from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
var router = express.Router();


// Redirection des requêtes vers le endpoint de login de l'auth-service
router.post('/login', createProxyMiddleware({
    target: 'http://auth-service:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/login': '/auth/login',
    },
    on: {
        proxyReq: fixRequestBody, // on transmet également le corps de la requête
    },
})
);

// Redirection des requêtes vers le endpoint de vérification de token de l'auth-service
router.post(
    '/verify',
    createProxyMiddleware({
        target: 'http://auth-service:3002',
        changeOrigin: true,
        pathRewrite: {
            '^/verify': '/auth/verify',
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (!proxyReq.getHeader('Content-Type')) {
                    proxyReq.setHeader('Content-Type', 'application/json'); // on fixe le Content-Type
                }
            },
        },
    })
);

export default router;