const express = require('express');

const axios = require('axios');

// Get port from command line argument
const PORT = process.argv[2] || 3001;
const app = express();

// Redis Configuration
const REDIS_URL = 'http://localhost:6379';

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[Worker ${PORT}] ${timestamp} - ${req.method} ${req.url}`);
    next();
});

app.get('*', async (req, res) => {
    const cacheKey = encodeURIComponent(req.originalUrl); // Encode key for URL safety

    // --- 1. CACHE CHECK (Ask Redis) ---
    try {
        const redisResponse = await axios.get(`${REDIS_URL}/get/${cacheKey}`);
        console.log(`   ⚡ REDIS HIT! Serving from Cache.`);
        const cachedResponse = redisResponse.data.value;
        cachedResponse.source = 'Redis Cache (Fast)';
        return res.json(cachedResponse);
    } catch (err) {
        // 404 means key not found (Cache Miss)
        if (err.response && err.response.status === 404) {
            console.log(`   🐢 REDIS MISS. Fetching from "Database" (3s delay)...`);
        } else {
            console.error(`   ⚠️ Redis Error: ${err.message}`);
        }
    }

    // --- 2. DATABASE SIMULATION (The "Slow Path") ---
    setTimeout(async () => {
        const responseData = {
            message: `Hello from Server ${PORT}`,
            port: parseInt(PORT),
            timestamp: new Date().toISOString(),
            source: 'Database (Slow)'
        };

        // --- 3. SAVE TO REDIS ---
        try {
            await axios.post(`${REDIS_URL}/set`, {
                key: cacheKey,
                value: responseData
            });
            console.log(`   💾 Saved to Redis.`);
        } catch (error) {
            console.error('   ❌ Failed to save to Redis:', error.message);
        }

        res.json(responseData);
    }, 3000); // 3000ms = 3 Seconds Latency
});

app.listen(PORT, () => {
    console.log(`🚀 Worker Server running on http://localhost:${PORT}`);
});