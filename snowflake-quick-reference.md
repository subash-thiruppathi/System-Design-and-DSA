# Snowflake ID - Quick Reference Card

## 📋 Quick Facts

| Attribute | Value |
|-----------|-------|
| **Format** | `[Timestamp][ServerID][Sequence]` |
| **Length** | 16 digits |
| **Throughput** | 100 IDs/ms per server |
| **Database** | Not required |
| **Sortable** | Yes (chronological) |
| **Used By** | Discord, Instagram, Twitter |

---

## 🔢 ID Breakdown

```
1769597092511100
├─────────────┘│└─┘
│              │ └─ Sequence (00-99)
│              └─── Server ID (1-9)
└────────────────── Timestamp (ms since epoch)
```

---

## ⚡ Quick Implementation

```javascript
class SnowflakeGenerator {
    constructor(serverId) {
        this.serverId = serverId;
        this.lastTimestamp = -1;
        this.sequence = 0;
    }

    generateId() {
        let ts = Date.now();
        
        if (ts === this.lastTimestamp) {
            this.sequence++;
        } else {
            this.sequence = 0;
        }
        
        this.lastTimestamp = ts;
        const seq = String(this.sequence).padStart(2, '0');
        return `${ts}${this.serverId}${seq}`;
    }
}
```

---

## 🎯 Usage

```javascript
// Create generator for server 1
const generator = new SnowflakeGenerator(1);

// Generate IDs
const id1 = generator.generateId(); // 1769597092511100
const id2 = generator.generateId(); // 1769597092511101
const id3 = generator.generateId(); // 1769597092511102
```

---

## ✅ Uniqueness Guarantee

| Scenario | Result | Example |
|----------|--------|---------|
| Different time | Different IDs | `1769597092511100` vs `1769597092512100` |
| Different server | Different IDs | `1769597092511100` vs `1769597092511200` |
| Same ms, same server | Sequence increments | `1769597092511100` → `1769597092511101` |

---

## 🔍 Parsing

```javascript
// Extract components
const id = "1769597092511100";
const timestamp = id.slice(0, -3);    // "1769597092511"
const serverId = id.slice(-3, -2);    // "1"
const sequence = id.slice(-2);        // "00"

// Convert to date
const date = new Date(parseInt(timestamp));
// 2026-01-28T10:44:52.511Z
```

---

## ⚠️ Edge Cases

### Sequence Overflow (>99 in same ms)
```javascript
if (this.sequence > 99) {
    // Wait for next millisecond
    while (Date.now() === this.lastTimestamp) {}
    this.sequence = 0;
}
```

### Clock Drift (time goes backwards)
```javascript
if (currentTimestamp < this.lastTimestamp) {
    throw new Error("Clock moved backwards!");
}
```

---

## 📊 Performance

```
Single Server:
  100 IDs/millisecond
  100,000 IDs/second
  6,000,000 IDs/minute

10 Servers:
  1,000 IDs/millisecond
  1,000,000 IDs/second
  60,000,000 IDs/minute
```

---

## 🆚 vs Other Approaches

| Feature | Snowflake | UUID | Auto-Increment |
|---------|-----------|------|----------------|
| Length | 16 digits | 36 chars | Variable |
| Sortable | ✅ Yes | ❌ No | ✅ Yes |
| Database | ❌ No | ❌ No | ✅ Required |
| Distributed | ✅ Yes | ✅ Yes | ❌ No |
| Readable | ⚠️ Okay | ❌ No | ✅ Yes |

---

## 💡 When to Use

### ✅ Use Snowflake When:
- Building distributed systems
- Need chronological sorting
- Want high throughput
- Don't want database dependency

### ❌ Don't Use When:
- Need very short IDs (use Base62 encoding)
- Need human-readable codes (use URL shortener)
- Single server only (use auto-increment)

---

## 🔗 Files

- **Implementation**: `snowflake-id-generator.js`
- **Full Guide**: `snowflake-guide.md`
- **Comparison**: `id-generation-comparison.md`

---

## 🎓 Remember

> "Snowflake IDs are unique because they combine **time**, **location** (server), and **sequence**. No database needed!"

---

**Pro Tip**: The timestamp component makes IDs sortable by creation time - perfect for feeds and timelines! 📱
