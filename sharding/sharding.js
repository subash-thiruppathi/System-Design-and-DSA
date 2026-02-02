const shardA = []; // Shard 0
const shardB = []; // Shard 1
const shardC = []; // Shard 2

// Helper map to access shards by index
const shards = [shardA, shardB, shardC];

/**
 * Determines which shard to use based on the User ID.
 * Uses the Modulo Operator (%) to ensure even distribution.
 * @param {number} userId 
 * @returns {number} The index of the shard (0, 1, or 2)
 */
function getShard(userId) {
    return userId % 3;
}

/**
 * Routes the user to the correct shard and saves them.
 * @param {number} userId 
 * @param {string} name 
 */
function saveUser(userId, name) {
    const shardIndex = getShard(userId);
    const targetShard = shards[shardIndex];

    const user = { userId, name };
    targetShard.push(user);

    // Visualize the routing
    const shardName = ['A', 'B', 'C'][shardIndex];
    console.log(`[Router] User ${userId} (${name})  --->  Shard ${shardName}`);
}

console.log("╔════════════════════════════════════╗");
console.log("║    🗄️  SHARDING PROXY SIMULATION   ║");
console.log("╚════════════════════════════════════╝\n");

// Test Cases: Users 1 to 6
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
    { id: 6, name: "Frank" }
];

console.log("--- Routing Traffic ---");
users.forEach(u => saveUser(u.id, u.name));

console.log("\n--- Final Database Storage ---");
console.log("Shard A (User ID % 3 == 0):", JSON.stringify(shardA, null, 2));
console.log("Shard B (User ID % 3 == 1):", JSON.stringify(shardB, null, 2));
console.log("Shard C (User ID % 3 == 2):", JSON.stringify(shardC, null, 2));
