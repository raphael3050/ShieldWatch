import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

describe('[auth-service] API Tests', () => {

    // Test pour la route GET /api/status
    describe('GET /', () => {
        it('should return status 200', async () => {
            const res = await request(app).get('/');
            expect(res.status).to.equal(200);
        });
    });

    // Test pour la route POST /auth/login
    describe('POST /auth/login', () => {

        it('should return a token for valid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });

        it('should return 401 for invalid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ username: 'wronguser', password: 'wrongpass' });

            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message', 'Nom d’utilisateur ou mot de passe incorrect');
        });

    });

    // Test pour la route POST /auth/verify
    describe('POST /auth/verify', () => {

        it('should return 200 for valid token', async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
            const token = resLogin.body.token;

            const res = await request(app)
                .post('/auth/verify')
                .set('Cookie', `token=${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Token valide');
        });

        it('should return 403 for missing token', async () => {
            const res = await request(app)
                .post('/auth/verify')
                .send();

            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('message', 'Token requis');
        });

        it('should return 403 for invalid token', async () => {
            const res = await request(app)
                .post('/auth/verify')
                .set('Cookie', `token=invalidtoken`);

            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('message', 'Token invalide');
        });
    });

    // Test pour la route POST /auth/signup
    describe('POST /auth/signup (creation)', () => {

        let token;

        // Connexion avec l'utilisateur admin pour obtenir un token
        before(async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
            token = resLogin.body.token;
        });

        it('should return 201 for admin user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .set('Cookie', `token=${token}`)
                .send({ username: 'testuser7', password: 'testpass7', role: 'user' });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Utilisateur créé avec succès');
        });

        it('should return 400 for existing user', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .set('Cookie', `token=${token}`)
                .send({ username: 'testuser7', password: 'testpass7', role: 'user' });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('message', 'Cet utilisateur existe déjà');
        });

        it('should return 403 for non-admin user', async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'testuser7', password: 'testpass7' });
            token = resLogin.body.token;

            const res = await request(app)
                .post('/auth/signup')
                .set('Cookie', `token=${token}`)
                .send({ username: 'testuser8', password: 'testpass8', role: 'user' });

            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('message', 'Accès refusé');
        });

        // Supprimer l'utilisateur 
        it('should return 200 for admin user', async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
            token = resLogin.body.token;

            const res = await request(app)
                .delete('/auth/delete/testuser7')
                .set('Cookie', `token=${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Utilisateur testuser7 supprimé avec succès');
        });

    });

    // Test pour la route /auth/update/:username
    describe('PUT /auth/update/:username (modification)', () => {
        it('should return 200 for admin user', async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
            const token = resLogin.body.token;

            const resSignup = await request(app)
                .post('/auth/signup')
                .set('Cookie', `token=${token}`)
                .send({ username: 'testuser2', password: 'testpass2', role: 'user' });


            const res = await request(app)
                .put('/auth/update/testuser2')
                .set('Cookie', `token=${token}`)
                .send({ role: 'admin' });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Utilisateur testuser2 mis à jour avec succès');
        });

        // Supprimer l'utilisateur 
        it('should delete testuser...', async () => {
            const resLogin = await request(app)
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' });
            const token = resLogin.body.token;

            const res = await request(app)
                .delete('/auth/delete/testuser2')
                .set('Cookie', `token=${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Utilisateur testuser2 supprimé avec succès');
        });
    });

});
