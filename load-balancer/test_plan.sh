#!/bin/bash

echo "---------------------------------------------------"
echo "🧪 TEST STEP 1: First Request (Cache Miss)"
echo "   Expectation: ~3 seconds delay (Fetching from DB)"
echo "---------------------------------------------------"

# %3N for milliseconds is not available on all dates, using time command for simplicity
time curl -s http://localhost:9090/my-key
echo ""
echo ""

echo "---------------------------------------------------"
echo "🧪 TEST STEP 2: Second Request (Cache Hit)"
echo "   Expectation: Instant response (Serving from Redis Mock)"
echo "---------------------------------------------------"

time curl -s http://localhost:9090/my-key
echo ""
echo ""
