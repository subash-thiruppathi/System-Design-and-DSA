const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 6379;

// --- REDIS DATA STORE ---
// The "Single Source of Truth"
const redisStore = new Map();

app.use(bodyParser.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`[Redis Mock] ${req.method} ${req.url}`);
    next();
});

// GET command: Retrieve a value by key
// Usage: GET /get/:key
app.get('/get/:key', (req, res) => {
    const key = req.params.key;
    const val = redisStore.get(key);

    if (val) {
        console.log(`   ✅ FOUND: ${key}`);
        return res.json({ value: val });
    } else {
        console.log(`   ❌ MISS: ${key}`);
        return res.status(404).json({ error: 'Key not found' });
    }
});

// SET command: Store a value by key
// Usage: POST /set
// Body: { "key": "...", "value": "..." }
app.post('/set', (req, res) => {
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).json({ error: 'Missing key or value' });
    }

    redisStore.set(key, value);
    console.log(`   💾 STORED: ${key}`);
    res.json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`🧱 Mock Redis Server running on port ${PORT}`);
});
