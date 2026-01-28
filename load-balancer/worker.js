const express = require('express');

// Get port from command line argument
const PORT = process.argv[2] || 3001;
const app = express();

// --- 1. THE CACHE LAYER (In-Memory RAM) ---
// This acts like Redis. It stores data so we don't have to "compute" it again.
const requestCache = new Map();

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[Worker ${PORT}] ${timestamp} - ${req.method} ${req.url}`);
    next();
});

app.get('*', (req, res) => {
    const cacheKey = req.originalUrl; // Use the URL as the unique key

    // --- 2. CACHE CHECK (The "Fast Path") ---
    if (requestCache.has(cacheKey)) {
        console.log(`   ⚡ CACHE HIT! Serving immediately.`);
        const cachedResponse = requestCache.get(cacheKey);
        // Add a flag to prove it came from cache
        cachedResponse.source = 'RAM Cache (Fast)';
        return res.json(cachedResponse);
    }

    // --- 3. DATABASE SIMULATION (The "Slow Path") ---
    console.log(`   🐢 CACHE MISS. Fetching from "Database" (3s delay)...`);

    setTimeout(() => {
        const responseData = {
            message: `Hello from Server ${PORT}`,
            port: parseInt(PORT),
            timestamp: new Date().toISOString(),
            source: 'Database (Slow)'
        };

        // SAVE to Cache before sending
        requestCache.set(cacheKey, responseData);

        res.json(responseData);
    }, 3000); // 3000ms = 3 Seconds Latency
});

app.listen(PORT, () => {
    console.log(`🚀 Worker Server running on http://localhost:${PORT}`);
});