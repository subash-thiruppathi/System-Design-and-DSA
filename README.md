# System Design and DSA implementations

A comprehensive collection of System Design components, distributed systems algorithms, and Data Structures & Algorithms (DSA) implementations in JavaScript/Node.js.

## 🚀 Project Overview

This repository serves as a practical guide to understanding core system design concepts through hands-on implementation and detailed documentation. Each module includes code examples, architectural explanations, and performance characteristics.

## 🏗️ System Design Components

### 1. Load Balancer (`/load-balancer`)
*   **Concept**: Implementation of a Round-Robin Load Balancer.
*   **Features**: Reverse proxy, worker pool management, and request distribution.
*   **Key Files**: `load-balancer.js`, `worker.js`, `start-all.sh`.
*   [View Details](./load-balancer/README.md)

### 2. Distributed ID Generation
*   **Snowflake ID Generator**: A stateless, distributed unique ID generation algorithm (similar to Twitter/Discord).
    *   `snowflake-id-generator.js`: Implementation.
    *   `snowflake-guide.md`: Complete architectural guide.
*   **Comparison**: `id-generation-comparison.md` comparing Snowflake vs URL Shortener (Base62) approaches.

### 3. Database & Indexing
*   **Concept**: Deep dive into how database indexing works to optimize query performance.
*   **Guide**: `database-indexing-explained.md`.

## 🧮 Algorithms & Encoding

*   **Base62 Encoding**: `encode-base62.js` - Implementation of Base62 encoding, commonly used in URL shorteners and short-ID generation.
*   **Array Performance**: `array-performance-comparison.js` - Benchmarking and comparing performance of different array operations in JavaScript.

## 🛠️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14+)
*   npm

### Installation
```bash
# Clone the repository
git clone https://github.com/subash-thiruppathi/System-Design-and-DSA.git

# Navigate to the project directory
cd System-Design-and-DSA

# For Load Balancer
cd load-balancer
npm install
```

## 📚 Learning Objectives

- ✅ Understand **distributed systems** through stateless ID generation.
- ✅ Implement **high-level architectural patterns** like Load Balancing.
- ✅ Master **data encoding** techniques for URL shortening.
- ✅ Analyze **performance trade-offs** in common data structure operations.
- ✅ Grasp **database optimization** strategies.

## 📝 License
MIT
