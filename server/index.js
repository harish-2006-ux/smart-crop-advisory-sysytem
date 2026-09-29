const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const history = [];
let latest = null;
let lastSeen = null;

app.use(express.json({ limit: '2mb' }));

function validateReading(body) {
  const values = ['soilMoisture', 'soilPH', 'temperature', 'humidity'];
  if (!values.every((key) => typeof body[key] === 'number' && Number.isFinite(body[key]))) {
    return 'Invalid sensor reading';
  }
  if (body.soilMoisture < 0 || body.soilMoisture > 100 || body.soilPH < 0 || body.soilPH > 14 || body.humidity < 0 || body.humidity > 100 || body.temperature < -40 || body.temperature > 85) {
    return 'Invalid sensor reading';
  }
  return null;
}

app.post('/api/hardware/telemetry', (req, res) => {
  const error = validateReading(req.body || {});
  if (error) return res.status(400).json({ error });
  const reading = { ...req.body, timestamp: new Date().toISOString(), source: 'LIVE HARDWARE' };
  latest = reading;
  lastSeen = Date.now();
  history.push(reading);
  if (history.length > 120) history.shift();
  res.status(201).json({ status: 'success', reading });
});

app.get('/api/hardware/latest', (_req, res) => {
  res.json({ available: Boolean(latest), reading: latest });
});

app.get('/api/hardware/history', (_req, res) => {
  res.json({ readings: history.slice(-60) });
});

app.get('/api/hardware/status', (_req, res) => {
  const available = Boolean(lastSeen && Date.now() - lastSeen < 120000);
  res.json({ available, status: available ? 'LIVE HARDWARE' : 'Hardware unavailable', lastUpdated: latest?.timestamp || null });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'smart-crop-advisory-system' }));

const dist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(dist));
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Smart Crop Advisory System listening on port ${PORT}`));
