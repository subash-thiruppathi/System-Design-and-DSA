/**
 * Snowflake ID Generator
 * 
 * A simplified version of the Snowflake algorithm used by Discord, Instagram, and Twitter.
 * Generates unique IDs without requiring a database by combining:
 * - Timestamp (milliseconds)
 * - Server ID (which server generated this ID)
 * - Sequence number (handles multiple requests in the same millisecond)
 * 
 * Format: [Timestamp][ServerID][Sequence]
 * Example: 170000000052100 = Timestamp(170000000052) + ServerID(1) + Sequence(00)
 */
class SnowflakeGenerator {
    /**
     * Creates a new Snowflake ID generator for a specific server.
     * 
     * @param {number} serverId - The unique identifier for this server (e.g., 1, 2, 3)
     */
    constructor(serverId) {
        this.serverId = serverId;
        this.lastTimestamp = -1;
        this.sequence = 0;

        // Configuration
        this.maxSequence = 99; // Allows 100 IDs per millisecond (0-99)

        console.log(`✓ Snowflake Generator initialized for Server ${serverId}`);
    }

    /**
     * Generates a unique Snowflake ID.
     * 
     * @returns {string} - A unique ID in format: [Timestamp][ServerID][Sequence]
     */
    generateId() {
        // Step A: Get current timestamp
        let currentTimestamp = Date.now();

        // Step B: Handle traffic jam (multiple requests in same millisecond)
        if (currentTimestamp === this.lastTimestamp) {
            // Same millisecond - increment sequence
            this.sequence++;

            // If we've exceeded max sequence, wait for next millisecond
            if (this.sequence > this.maxSequence) {
                console.warn(`⚠️  Sequence overflow! Waiting for next millisecond...`);
                currentTimestamp = this.waitForNextMillisecond(currentTimestamp);
                this.sequence = 0;
            }
        } else if (currentTimestamp > this.lastTimestamp) {
            // New millisecond - reset sequence
            this.sequence = 0;
        } else {
            // Clock moved backwards - this shouldn't happen!
            throw new Error(`Clock moved backwards! Last: ${this.lastTimestamp}, Current: ${currentTimestamp}`);
        }

        // Update last timestamp
        this.lastTimestamp = currentTimestamp;

        // Step C: Build the ID by combining timestamp, server ID, and sequence
        const id = this.buildId(currentTimestamp, this.serverId, this.sequence);

        return id;
    }

    /**
     * Builds the final ID string from components.
     * 
     * @param {number} timestamp - Current timestamp in milliseconds
     * @param {number} serverId - Server identifier
     * @param {number} sequence - Sequence number
     * @returns {string} - The complete Snowflake ID
     */
    buildId(timestamp, serverId, sequence) {
        // Pad sequence to 2 digits (00-99)
        const paddedSequence = String(sequence).padStart(2, '0');

        // Format: [Timestamp][ServerID][Sequence]
        const id = `${timestamp}${serverId}${paddedSequence}`;

        return id;
    }

    /**
     * Waits for the next millisecond (used when sequence overflows).
     * 
     * @param {number} lastTimestamp - The last timestamp we used
     * @returns {number} - The next timestamp
     */
    waitForNextMillisecond(lastTimestamp) {
        let timestamp = Date.now();
        while (timestamp <= lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }

    /**
     * Parses a Snowflake ID back into its components.
     * 
     * @param {string} id - The Snowflake ID to parse
     * @returns {object} - Object containing timestamp, serverId, and sequence
     */
    parseId(id) {
        // Extract components from the ID
        const sequence = parseInt(id.slice(-2));
        const serverId = parseInt(id.slice(-3, -2));
        const timestamp = parseInt(id.slice(0, -3));

        return {
            timestamp,
            serverId,
            sequence,
            date: new Date(timestamp).toISOString()
        };
    }

    /**
     * Gets statistics about this generator.
     * 
     * @returns {object} - Statistics object
     */
    getStats() {
        return {
            serverId: this.serverId,
            lastTimestamp: this.lastTimestamp,
            currentSequence: this.sequence,
            maxSequence: this.maxSequence
        };
    }
}

// ============================================
// DEMO: Snowflake ID Generator in Action
// ============================================

console.log("\n=== Snowflake ID Generator Demo ===\n");

// Create two server instances
console.log("1. Creating Server Instances:");
console.log("-".repeat(60));
const server1 = new SnowflakeGenerator(1);
const server2 = new SnowflakeGenerator(2);

// Generate IDs from both servers
console.log("\n2. Generating IDs from Server 1:");
console.log("-".repeat(60));
const server1Ids = [];
for (let i = 0; i < 5; i++) {
    const id = server1.generateId();
    server1Ids.push(id);
    console.log(`ID ${i + 1}: ${id}`);
}

console.log("\n3. Generating IDs from Server 2:");
console.log("-".repeat(60));
const server2Ids = [];
for (let i = 0; i < 5; i++) {
    const id = server2.generateId();
    server2Ids.push(id);
    console.log(`ID ${i + 1}: ${id}`);
}

// Simulate traffic jam (multiple IDs in same millisecond)
console.log("\n4. Simulating Traffic Jam (Same Millisecond):");
console.log("-".repeat(60));
const rapidIds = [];
console.log("Generating 10 IDs as fast as possible...");
for (let i = 0; i < 10; i++) {
    const id = server1.generateId();
    rapidIds.push(id);
}
console.log("Generated IDs:");
rapidIds.forEach((id, index) => {
    console.log(`  ${index + 1}. ${id}`);
});

// Check uniqueness
console.log("\n5. Verifying Uniqueness:");
console.log("-".repeat(60));
const allIds = [...server1Ids, ...server2Ids, ...rapidIds];
const uniqueIds = new Set(allIds);
console.log(`Total IDs generated: ${allIds.length}`);
console.log(`Unique IDs: ${uniqueIds.size}`);
console.log(`All unique: ${allIds.length === uniqueIds.size ? '✓ YES' : '✗ NO'}`);

// Parse an ID to show its components
console.log("\n6. Parsing an ID:");
console.log("-".repeat(60));
const sampleId = server1Ids[0];
const parsed = server1.parseId(sampleId);
console.log(`Sample ID: ${sampleId}`);
console.log(`  Timestamp: ${parsed.timestamp}`);
console.log(`  Server ID: ${parsed.serverId}`);
console.log(`  Sequence: ${parsed.sequence}`);
console.log(`  Created at: ${parsed.date}`);

// Show server statistics
console.log("\n7. Server Statistics:");
console.log("-".repeat(60));
const stats1 = server1.getStats();
const stats2 = server2.getStats();
console.log("Server 1:");
console.log(`  Server ID: ${stats1.serverId}`);
console.log(`  Last Timestamp: ${stats1.lastTimestamp}`);
console.log(`  Current Sequence: ${stats1.currentSequence}`);
console.log(`  Max Sequence: ${stats1.maxSequence}`);
console.log("\nServer 2:");
console.log(`  Server ID: ${stats2.serverId}`);
console.log(`  Last Timestamp: ${stats2.lastTimestamp}`);
console.log(`  Current Sequence: ${stats2.currentSequence}`);
console.log(`  Max Sequence: ${stats2.maxSequence}`);

// Demonstrate cross-server uniqueness
console.log("\n8. Cross-Server Uniqueness Test:");
console.log("-".repeat(60));
const mixedIds = [];
for (let i = 0; i < 5; i++) {
    mixedIds.push(server1.generateId());
    mixedIds.push(server2.generateId());
}
const uniqueMixed = new Set(mixedIds);
console.log(`Generated ${mixedIds.length} IDs from both servers`);
console.log(`All unique: ${mixedIds.length === uniqueMixed.size ? '✓ YES' : '✗ NO'}`);

console.log("\n=== Demo Complete ===");
console.log("\n💡 Key Takeaway:");
console.log("Snowflake IDs are unique because they combine:");
console.log("  1. Timestamp (changes every millisecond)");
console.log("  2. Server ID (different for each server)");
console.log("  3. Sequence (handles multiple requests per millisecond)");
console.log("\nNo database needed! ✨");
