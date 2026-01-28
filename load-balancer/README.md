# Node.js Load Balancer - Round Robin Implementation

A production-ready load balancer built from scratch in Node.js to understand how reverse proxies like **Nginx** work under the hood.

## 🎯 What This Project Demonstrates

This project implements a **Round-Robin Load Balancer** that distributes incoming HTTP requests across multiple worker servers in a circular pattern. It's a fundamental algorithm used by production load balancers like Nginx, HAProxy, and AWS ELB.

## 🏗️ Architecture

```
Client Request
      ↓
Load Balancer (Port 9090)
      ↓
Round-Robin Algorithm
      ↓
   ┌──┴──┬──────┐
   ↓     ↓      ↓
Worker1 Worker2 Worker3
(3001)  (3002)  (3003)
```

### Components

1. **Worker Servers** (`worker.js`)
   - Simple Express servers that handle actual requests
   - Each runs on a different port (3001, 3002, 3003)
   - Returns JSON response identifying which server handled the request

2. **Load Balancer** (`load-balancer.js`)
   - Runs on port 8080
   - Maintains a pool of worker servers
   - Implements round-robin distribution algorithm
   - Proxies requests using `http-proxy-middleware`

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Navigate to the project directory
cd "load-balancer"

# Install dependencies
npm install
```

### Running the System

**Option 1: Start Everything at Once (Recommended)**
```bash
npm run start-all
```

**Option 2: Start Servers Individually**

In separate terminal windows:
```bash
# Terminal 1 - Worker 1
npm run worker1

# Terminal 2 - Worker 2
npm run worker2

# Terminal 3 - Worker 3
npm run worker3

# Terminal 4 - Load Balancer
npm run load-balancer
```

## 🧪 Testing the Load Balancer

Once all servers are running, test the round-robin distribution:

```bash
# Send multiple requests
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
```

**Expected Output Pattern:**
```json
{"message":"Hello from Server 3001","port":3001,...}
{"message":"Hello from Server 3002","port":3002,...}
{"message":"Hello from Server 3003","port":3003,...}
{"message":"Hello from Server 3001","port":3001,...}
{"message":"Hello from Server 3002","port":3002,...}
{"message":"Hello from Server 3003","port":3003,...}
```

Notice the pattern: **3001 → 3002 → 3003 → 3001 → 3002 → 3003...**

### Automated Testing Script

```bash
# Send 10 requests and see the distribution
for i in {1..10}; do
  echo "Request $i:"
  curl -s http://localhost:8080 | jq '.port'
  sleep 0.5
done
```

## 🔍 How Round-Robin Works

The algorithm is simple but effective:

```javascript
// Worker pool
const workers = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
];

// Current index
let currentServerIndex = 0;

// For each request:
const targetWorker = workers[currentServerIndex];
currentServerIndex = (currentServerIndex + 1) % workers.length;
```

**Key Points:**
- Maintains a `currentServerIndex` variable
- On each request, selects `workers[currentServerIndex]`
- Increments index and wraps around using modulo operator
- Ensures even distribution across all workers

## 📊 Monitoring

The load balancer logs every routing decision:

```
[Load Balancer] 2026-01-28T12:10:30.123Z
   ├─ Request: GET /
   ├─ Forwarding to: http://localhost:3001
   └─ Round-robin index: 0

✅ Response received from http://localhost:3001 - Status: 200
```

## 🎓 Interview Talking Points

When discussing this project in interviews:

1. **"I built a reverse proxy from scratch"**
   - Explain how you implemented request forwarding
   - Discuss the difference between reverse proxy and forward proxy

2. **"I understand load balancing algorithms"**
   - Explain Round-Robin and its trade-offs
   - Mention other algorithms (Least Connections, IP Hash, Weighted Round-Robin)

3. **"I know how Nginx works internally"**
   - Explain that Nginx uses similar concepts
   - Discuss upstream servers and proxy_pass directives

4. **"I've handled production concerns"**
   - Error handling when workers fail
   - Graceful shutdown
   - Request logging and monitoring

## 🔧 Advanced Enhancements (Optional)

Want to take this further? Try implementing:

- **Health Checks**: Periodically ping workers and remove unhealthy ones
- **Weighted Round-Robin**: Give more requests to powerful servers
- **Least Connections**: Route to server with fewest active connections
- **Session Persistence**: Sticky sessions using cookies
- **HTTPS Support**: Add SSL/TLS termination
- **Metrics Dashboard**: Track request distribution and response times

## 📚 Related Concepts

- **Nginx**: Production reverse proxy and load balancer
- **HAProxy**: High-performance load balancer
- **AWS ELB/ALB**: Cloud-based load balancing
- **Kubernetes Service**: Container orchestration load balancing

## 🤝 How This Relates to Real Systems

**Nginx Configuration Equivalent:**
```nginx
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 8080;
    location / {
        proxy_pass http://backend;
    }
}
```

Your Node.js implementation does exactly what this Nginx config does!

## 📝 License

MIT

---

**Built to understand system design fundamentals** 🚀
