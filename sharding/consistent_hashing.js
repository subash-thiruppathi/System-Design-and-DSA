const crypto = require('crypto');

class ConsistentHash {
    constructor() {
        this.ring = [];
    }

    _hash(key) {
        const hash = crypto.createHash('md5').update(key).digest('hex');
        return parseInt(hash.substring(0, 4), 16);
    }

    addNode(node) {
        const hash = this._hash(node);
        this.ring.push({ hash, node });
        this.ring.sort((a, b) => a.hash - b.hash); // Sort for clockwise search
        console.log(`Checking in ${node} at seat #${hash}`);
    }

    getNode(key) {
        const keyHash = this._hash(key);
        console.log(`Looking for ${key} (Hash: ${keyHash})...`);

        // --- YOUR CODE STARTS HERE ---

        // 1. Loop through the ring to find the first server > keyHash
        for (const entry of this.ring) {
            if (entry.hash >= keyHash) {
                return entry.node;
            }
        }

        // 2. If found, return that node.node (Handled inside loop)

        // 3. If loop finishes (Wrap Around), return this.ring[0].node
        return this.ring[0].node;

        // --- YOUR CODE ENDS HERE ---
    }
}

// Test
const ch = new ConsistentHash();
ch.addNode("Server A");
ch.addNode("Server B");
ch.addNode("Server C");

console.log("\n--- TRAFFIC ROUTING ---");
console.log("User 1 ->", ch.getNode("User 1"));
console.log("User 2 ->", ch.getNode("User 2"));
console.log("User 3 ->", ch.getNode("User 3"));
