/**
 * Encodes a decimal number into a Base62 string.
 * Uses the character set 0-9, a-z, A-Z.
 * 
 * @param {number} num - The decimal number to encode.
 * @returns {string} - The Base62 encoded string.
 */
function encode(num) {
    if (num === 0) return '0';
    if (isNaN(num) || num < 0) return 'Invalid input';

    const CHAR_SET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let res = "";

    while (num > 0) {
        let index = num % 62;
        res = CHAR_SET[index] + res; // Prepend character
        num = Math.floor(num / 62);
    }

    return res;
}

/**
 * UrlShortener Service Class
 * Simulates a real backend service for URL shortening (like Instagram/Twitter ID generation).
 */
class UrlShortener {
    constructor() {
        // Internal "database" storage using Map for better performance
        this.urlToCode = new Map();  // Maps: url -> shortCode
        this.codeToUrl = new Map();  // Maps: shortCode -> url

        // Counter starts at 100000 to get 3-4 character strings immediately
        this.currentId = 100000;
    }

    /**
     * Shortens a URL and returns the short code.
     * 
     * @param {string} url - The URL to shorten.
     * @returns {string} - The generated short code.
     */
    shorten(url) {
        // Check if URL already exists in our database
        if (this.urlToCode.has(url)) {
            return this.urlToCode.get(url);
        }

        // Increment the ID counter
        this.currentId++;

        // Generate the short code using Base62 encoding
        const shortCode = encode(this.currentId);

        // Store in both mappings
        this.urlToCode.set(url, shortCode);
        this.codeToUrl.set(shortCode, url);

        return shortCode;
    }

    /**
     * Redirects from a short code to the original URL.
     * 
     * @param {string} shortCode - The short code to look up.
     * @returns {string|null} - The original URL, or null if not found.
     */
    redirect(shortCode) {
        return this.codeToUrl.get(shortCode) || null;
    }

    /**
     * Gets statistics about the URL shortener service.
     * 
     * @returns {object} - Statistics object with total URLs and current ID.
     */
    getStats() {
        return {
            totalUrls: this.urlToCode.size,
            currentId: this.currentId,
            nextId: this.currentId + 1
        };
    }
}

// ============================================
// DEMO: Using the UrlShortener Service
// ============================================

console.log("=== URL Shortener Service Demo ===\n");

// Create a new instance of the service
const urlShortener = new UrlShortener();

// Test URLs
const testUrls = [
    "https://www.instagram.com/p/very-long-post-id-12345678",
    "https://twitter.com/user/status/987654321",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://github.com/user/repository/issues/42"
];

console.log("1. Shortening URLs:");
console.log("-".repeat(50));

const shortCodes = [];
testUrls.forEach((url, index) => {
    const shortCode = urlShortener.shorten(url);
    shortCodes.push(shortCode);
    console.log(`URL ${index + 1}: ${url}`);
    console.log(`Short Code: ${shortCode}`);
    console.log(`Short URL: https://short.url/${shortCode}\n`);
});

console.log("\n2. Testing Redirect (retrieving original URLs):");
console.log("-".repeat(50));

shortCodes.forEach((code, index) => {
    const originalUrl = urlShortener.redirect(code);
    console.log(`Short Code: ${code}`);
    console.log(`Redirects to: ${originalUrl}`);
    console.log(`Match: ${originalUrl === testUrls[index] ? '✓' : '✗'}\n`);
});

console.log("\n3. Testing duplicate URL (should return same code):");
console.log("-".repeat(50));

const duplicateUrl = testUrls[0];
const firstCode = shortCodes[0];
const secondCode = urlShortener.shorten(duplicateUrl);

console.log(`Original URL: ${duplicateUrl}`);
console.log(`First short code: ${firstCode}`);
console.log(`Second short code: ${secondCode}`);
console.log(`Same code returned: ${firstCode === secondCode ? '✓' : '✗'}\n`);

console.log("\n4. Service Statistics:");
console.log("-".repeat(50));

const stats = urlShortener.getStats();
console.log(`Total URLs stored: ${stats.totalUrls}`);
console.log(`Current ID: ${stats.currentId}`);
console.log(`Next ID will be: ${stats.nextId}`);
console.log(`Next short code will be: ${encode(stats.nextId)}`);

console.log("\n=== Demo Complete ===");
