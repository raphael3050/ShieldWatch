import request from 'supertest';
import { expect } from 'chai';
import app from '../index.js';

describe('[threat-detection-service] API Tests', () => {

    // Test pour la route GET /api/status
    describe('GET /', () => {
        it('should return status 200', async () => {
            const res = await request(app).get('/');
            expect(res.status).to.equal(200);
        });
    });


    describe('GET /monitor/status', () => {
        it('should return status 200 and JSON', async () => {
            const res = await request(app).get('/monitor/status');
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('The service is connected to Kafka and MongoDB and ready to process requests');
        });
    });

    describe('POST /monitor', () => {
        it('should return status 200 and JSON', async () => {
            const res = await request(app).post('/monitor');
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('No threat detected');
        });
    });

    describe('POST /monitor ', () => {
        
        it('should return 403 (threat detected)', async () => {
            // send request with x-forwarded-for header
            const res = await request(app)
                .post('/monitor')
                .set('x-forwarded-for', '192.168.1.2');
            expect(res.status).to.equal(403);
            expect(res.text).to.contain('Threat detected and blocked ! youre ip is now blacklisted');
        });
    });

});
