const request = require('supertest');
const { app, server, io } = require('../server');

describe('Backend API Tests', () => {
  afterAll((done) => {
    // Close the server and Socket.io to allow tests to exit cleanly
    server.close();
    io.close();
    done();
  });

  describe('GET /api/predictions', () => {
    it('should return 200 and an array of predictions', async () => {
      const res = await request(app).get('/api/predictions');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('POST /api/predict', () => {
    it('should handle missing ML service connection gracefully', async () => {
      const payload = {
        account_id: 'TEST-123',
        transaction_amount: 5000,
        velocity_24h: 3
      };
      const res = await request(app)
        .post('/api/predict')
        .send(payload);
      
      // Since fetch to FASTAPI_URL will fail when ML service is not running
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
