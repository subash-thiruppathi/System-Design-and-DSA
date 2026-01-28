const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 9090;

// Worker server pool
const workers = [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
];

// Round-robin state
let currentServerIndex = 0;

// Custom middleware to implement round-robin load balancing
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();

    // Get the current worker
    const targetWorker = workers[currentServerIndex];

    // Log the routing decision
    console.log(`[Load Balancer] ${timestamp}`);
    console.log(`   ├─ Request: ${req.method} ${req.url}`);
    console.log(`   ├─ Forwarding to: ${targetWorker}`);
    console.log(`   └─ Round-robin index: ${currentServerIndex}\n`);

    // Increment and wrap around using modulo
    currentServerIndex = (currentServerIndex + 1) % workers.length;

    // Create a proxy for this specific request
    const proxy = createProxyMiddleware({
        target: targetWorker,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error(`❌ Error proxying to ${targetWorker}:`, err.message);
            res.status(502).json({
                error: 'Bad Gateway',
                message: `Worker server ${targetWorker} is unavailable`,
                timestamp: new Date().toISOString()
            });
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`✅ Response received from ${targetWorker} - Status: ${proxyRes.statusCode}\n`);
        }
    });

    // Execute the proxy
    proxy(req, res, next);
});

// Start the load balancer
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         🔄 ROUND-ROBIN LOAD BALANCER STARTED 🔄           ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  Load Balancer: http://localhost:${PORT}                    ║`);
    console.log('║                                                            ║');
    console.log('║  Worker Pool:                                              ║');
    workers.forEach((worker, index) => {
        console.log(`║    ${index + 1}. ${worker.padEnd(48)} ║`);
    });
    console.log('║                                                            ║');
    console.log('║  Algorithm: Round Robin                                    ║');
    console.log('║  Distribution: 1 → 2 → 3 → 1 → 2 → 3 ...                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('Ready to distribute requests! 🚀\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n[Load Balancer] Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n[Load Balancer] Shutting down gracefully...');
    process.exit(0);
});
