// Create an array with numbers from 1 to 100,000
const numbers = Array.from({ length: 100000 }, (_, i) => i + 1);

// Function to find 99999 by scanning (looping through the array)
function findByScanning(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}

// Function to find 99999 by accessing the index directly
function findByAccessing(arr, target) {
    // Since the array contains numbers 1 to 100,000 in order,
    // the index of a number is number - 1
    const index = target - 1;
    if (index >= 0 && index < arr.length && arr[index] === target) {
        return index;
    }
    return -1;
}

// Measure performance for scanning
console.time('Scan');
const scanResult = findByScanning(numbers, 99999);
console.timeEnd('Scan');
console.log(`Scanning found 99999 at index: ${scanResult}`);

// Measure performance for direct access
console.time('Access');
const accessResult = findByAccessing(numbers, 99999);
console.timeEnd('Access');
console.log(`Direct access found 99999 at index: ${accessResult}`);

// Display the performance difference
console.log('\n--- Performance Comparison ---');
console.log('Scanning: O(n) time complexity - iterates through the array');
console.log('Direct Access: O(1) time complexity - calculates the index directly');
