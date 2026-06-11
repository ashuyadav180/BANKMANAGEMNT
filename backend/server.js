const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

// API route to accept a prediction request from frontend, proxy to ML service, and save
app.post('/api/predict', async (req, res) => {
  try {
    const accountData = req.body;
    const accountId = accountData.account_id || `ACC-UNKNOWN-${Date.now()}`;
    
    // In a real proxy, we'd send to FastAPI using fetch
    const response = await fetch(`${FASTAPI_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData)
    });
    
    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: 'ML Service Error', details: err });
    }
    
    const result = await response.json();
    
    // Log to DB
    const insert = db.prepare(`
      INSERT INTO predictions (account_id, risk_score, verdict, features_json, top_factors_json)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insert.run(
      accountId,
      result.risk_score,
      result.verdict,
      JSON.stringify(accountData),
      JSON.stringify(result.top_factors)
    );
    
    // Emit alert via WebSockets
    const alertPayload = {
      account_id: accountId,
      ...result,
      timestamp: new Date().toISOString()
    };
    
    io.emit('new_prediction', alertPayload);
    
    if (result.verdict === 'HIGH') {
      io.emit('high_risk_alert', alertPayload);
    }
    
    res.json(alertPayload);
    
  } catch (error) {
    console.error("Prediction proxy error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get recent predictions
app.get('/api/predictions', (req, res) => {
  const limit = req.query.limit || 50;
  const rows = db.prepare('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?').all(limit);
  
  // parse JSON strings back to objects
  const parsedRows = rows.map(r => ({
    ...r,
    features: JSON.parse(r.features_json),
    top_factors: JSON.parse(r.top_factors_json)
  }));
  
  res.json(parsedRows);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Node.js Backend listening on port ${PORT}`);
  });
}

module.exports = { app, server, io };
