#!/bin/bash

echo "🚀 Starting Load Balancer System..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down all servers..."
  kill $(jobs -p) 2>/dev/null
  wait
  echo "✅ All servers stopped"
  exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start worker servers in background
echo "Starting Worker Servers..."
node worker.js 3001 &
WORKER1_PID=$!
echo "  ✓ Worker 1 started on port 3001 (PID: $WORKER1_PID)"

node worker.js 3002 &
WORKER2_PID=$!
echo "  ✓ Worker 2 started on port 3002 (PID: $WORKER2_PID)"

node worker.js 3003 &
WORKER3_PID=$!
echo "  ✓ Worker 3 started on port 3003 (PID: $WORKER3_PID)"

echo ""
sleep 2

# Start load balancer in foreground
echo "Starting Load Balancer..."
echo ""
node load-balancer.js

# Wait for all background jobs
wait
