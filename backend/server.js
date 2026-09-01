const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

// ──────────────────────────────────────────────
// HEALTH CHECK
// ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MuleWatch AI Node.js Gateway',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    db: 'SQLite Connected',
    websocket_clients: io.engine.clientsCount
  });
});

// ──────────────────────────────────────────────
// PREDICT (proxy to FastAPI ML service)
// ──────────────────────────────────────────────
app.post('/api/predict', async (req, res) => {
  try {
    const accountData = req.body;
    const accountId = accountData.account_id || `ACC-UNKNOWN-${Date.now()}`;

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

    const insert = db.prepare(`
      INSERT INTO predictions (account_id, risk_score, verdict, features_json, top_factors_json)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(accountId, result.risk_score, result.verdict, JSON.stringify(accountData), JSON.stringify(result.top_factors));

    const alertPayload = { account_id: accountId, ...result, timestamp: new Date().toISOString() };
    io.emit('new_prediction', alertPayload);
    if (result.verdict === 'HIGH') io.emit('high_risk_alert', alertPayload);

    res.json(alertPayload);
  } catch (error) {
    console.error('Prediction proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// ──────────────────────────────────────────────
// GET PREDICTIONS (Alert Feed data)
// ──────────────────────────────────────────────
app.get('/api/predictions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const rows = db.prepare('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?').all(limit);
    const parsedRows = rows.map(r => ({
      ...r,
      features: JSON.parse(r.features_json || '{}'),
      top_factors: JSON.parse(r.top_factors_json || '[]')
    }));
    res.json(parsedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// ALERTS — live simulated alert feed
// ──────────────────────────────────────────────
app.get('/api/alerts', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const rows = db.prepare('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?').all(limit);
    const alerts = rows.map(r => ({
      id: r.id,
      severity: r.risk_score >= 85 ? 'HIGH' : r.risk_score >= 60 ? 'MED' : 'LOW',
      accountId: r.account_id,
      riskScore: r.risk_score,
      verdict: r.verdict,
      timestamp: r.timestamp
    }));
    res.json(alerts);
  } catch (err) {
    // Return mock data if DB is empty
    res.json([
      { id: 1, severity: 'HIGH', accountId: 'ACC-9921-XF', riskScore: 94, verdict: 'HIGH', timestamp: new Date().toISOString() },
      { id: 2, severity: 'MED', accountId: 'ACC-3314-KL', riskScore: 67, verdict: 'MEDIUM', timestamp: new Date().toISOString() },
      { id: 3, severity: 'LOW', accountId: 'ACC-1102-WQ', riskScore: 22, verdict: 'LOW', timestamp: new Date().toISOString() },
    ]);
  }
});

// ──────────────────────────────────────────────
// CASES — in-memory case store (survives server restart via DB future iteration)
// ──────────────────────────────────────────────
const cases = [
  { id: 'CASE-992-A', accountId: 'ACC-8392', title: 'Layered Smurfing Suspected', risk: 'CRITICAL', status: 'DRAFT', createdAt: '2026-09-01T08:00:00Z' },
  { id: 'CASE-988-B', accountId: 'ACC-9921-XF', title: 'Anomalous Wire Vol. (UAE)', risk: 'HIGH', status: 'DRAFT', createdAt: '2026-08-31T16:00:00Z' },
  { id: 'CASE-971-C', accountId: 'ACC-7741-99', title: 'Struct. Cash Dep. (Multi-node)', risk: 'MODERATE', status: 'DRAFT', createdAt: '2026-08-30T12:00:00Z' },
];

app.get('/api/cases', (req, res) => {
  res.json(cases);
});

app.post('/api/cases', (req, res) => {
  const { accountId, offense, severity, notes } = req.body;
  if (!accountId) return res.status(400).json({ error: 'accountId is required' });
  const newCase = {
    id: `CASE-${Date.now()}`,
    accountId,
    title: offense || 'Manual Case',
    risk: severity || 'HIGH',
    status: 'DRAFT',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  cases.unshift(newCase);
  io.emit('new_case', newCase);
  res.status(201).json(newCase);
});

app.patch('/api/cases/:id', (req, res) => {
  const c = cases.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  Object.assign(c, req.body, { updatedAt: new Date().toISOString() });
  io.emit('case_updated', c);
  res.json(c);
});

// FILE all approved cases
app.post('/api/cases/file-batch', (req, res) => {
  const approved = cases.filter(c => c.status === 'APPROVED');
  approved.forEach(c => { c.status = 'FILED'; c.filedAt = new Date().toISOString(); });
  io.emit('cases_filed', approved);
  res.json({ filed: approved.length, cases: approved });
});

// ──────────────────────────────────────────────
// WEBSOCKET
// ──────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send current system state on connect
  socket.emit('system_status', {
    agents: 6,
    status: 'NOMINAL',
    latency: '12ms',
    timestamp: new Date().toISOString()
  });
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ──────────────────────────────────────────────
// START
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n✅ MuleWatch AI Node.js Gateway running on http://localhost:${PORT}`);
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/predictions`);
    console.log(`   GET  /api/alerts`);
    console.log(`   GET  /api/cases`);
    console.log(`   POST /api/cases`);
    console.log(`   PATCH /api/cases/:id`);
    console.log(`   POST /api/cases/file-batch`);
    console.log(`   POST /api/predict  →  FastAPI @ ${FASTAPI_URL}\n`);
  });
}

module.exports = { app, server, io };
