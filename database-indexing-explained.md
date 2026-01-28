# Database Indexing - Solving the Scanning Problem

## The Problem

**Scenario**: You're building a Job Bot with an `AppliedJobs` table.

```
AppliedJobs Table:
+----+----------------------------------+------------+----------+
| ID | Job_URL                          | Company    | Status   |
+----+----------------------------------+------------+----------+
| 1  | https://jobs.com/abc123          | Google     | Applied  |
| 2  | https://careers.net/xyz456       | Amazon     | Pending  |
| 3  | https://openings.io/def789       | Meta       | Applied  |
| ... | ...                             | ...        | ...      |
| 100k| https://work.com/mno999         | Netflix    | Rejected |
+----+----------------------------------+------------+----------+
```

**Query**: Find job details for `https://careers.net/xyz456`

**Without optimization**: The database scans every row → **O(N) time complexity** ❌

---

## The Solution: **INDEX** 🎯

An **INDEX** is a database feature that creates a separate data structure to enable fast lookups, similar to:
- An index in a book (jump directly to page numbers)
- A hash map or dictionary
- A binary search tree

### How It Works

When you create an index on `Job_URL`:

```sql
CREATE INDEX idx_job_url ON AppliedJobs(Job_URL);
```

The database creates a separate structure (commonly a B-Tree or Hash Table):

```
Index Structure (B-Tree example):
                    [https://jobs.com/abc123 → Row 1]
                   /                                  \
  [https://careers.net/xyz456 → Row 2]    [https://work.com/mno999 → Row 100k]
           /                \
         ...               ...
```

---

## Performance Comparison

| Operation | Without Index | With Index |
|-----------|---------------|------------|
| Search by Job_URL | **O(N)** - Scans all rows | **O(log N)** (B-Tree) or **O(1)** (Hash) |
| Search 100,000 records | ~100,000 comparisons | ~17 comparisons (B-Tree) or ~1 (Hash) |

### Real-World Example

```sql
-- WITHOUT INDEX: Full table scan
SELECT * FROM AppliedJobs WHERE Job_URL = 'https://careers.net/xyz456';
-- Scans: 1, 2, 3, 4, ... until found ❌ O(N)

-- WITH INDEX: Direct lookup
SELECT * FROM AppliedJobs WHERE Job_URL = 'https://careers.net/xyz456';
-- Uses index → Jumps directly to Row 2 ✅ O(log N) or O(1)
```

---

## Connection to Our Array Example

In our JavaScript example:

| Method | Database Equivalent | Time Complexity |
|--------|-------------------|-----------------|
| **Scanning** (loop) | Full table scan (no index) | O(N) |
| **Direct Access** (`arr[index]`) | Indexed lookup | O(1) |

```javascript
// Our array example showed:
Scanning: 1.268ms   // Like database WITHOUT index
Direct Access: 0.032ms   // Like database WITH index (40x faster!)
```

---

## Types of Database Indexes

### 1. **B-Tree Index** (Default in most databases)
- **Time Complexity**: O(log N)
- **Use Case**: Range queries, sorting
- **Example**: `WHERE Job_URL LIKE 'https://careers%'`

### 2. **Hash Index**
- **Time Complexity**: O(1) for exact matches
- **Use Case**: Equality searches only
- **Example**: `WHERE Job_URL = 'exact_url'`

### 3. **Full-Text Index**
- **Use Case**: Text searching
- **Example**: `WHERE description CONTAINS 'Python developer'`

---

## Trade-offs of Indexing

### ✅ Pros:
- **Faster reads**: O(N) → O(log N) or O(1)
- **Improved query performance**
- **Better user experience**

### ❌ Cons:
- **Slower writes**: Every INSERT/UPDATE/DELETE must update the index
- **Extra storage**: Index takes disk space
- **Maintenance overhead**: Indexes need to be rebuilt/reorganized

---

## When to Use Indexes

### ✅ Good Candidates:
- Columns frequently used in `WHERE` clauses
- Foreign keys (JOIN operations)
- Columns used in `ORDER BY`
- Large tables with many rows

### ❌ Avoid Indexing:
- Small tables (< 1000 rows)
- Columns with frequent updates
- Columns with low cardinality (e.g., boolean fields)

---

## Practical Example: Job Bot Database

```sql
-- Create the table
CREATE TABLE AppliedJobs (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Primary key auto-indexed
    job_url VARCHAR(500),
    company VARCHAR(100),
    position VARCHAR(200),
    status VARCHAR(50),
    applied_date DATE
);

-- Create indexes for fast searching
CREATE INDEX idx_job_url ON AppliedJobs(job_url);        -- O(log N) lookup
CREATE INDEX idx_company ON AppliedJobs(company);        -- Filter by company
CREATE INDEX idx_status ON AppliedJobs(status);          -- Filter by status
CREATE INDEX idx_applied_date ON AppliedJobs(applied_date);  -- Date range queries

-- Composite index for common queries
CREATE INDEX idx_company_status ON AppliedJobs(company, status);
```

### Query Performance After Indexing:

```sql
-- Fast lookup by Job_URL
SELECT * FROM AppliedJobs WHERE job_url = 'https://careers.net/xyz456';
-- Uses idx_job_url → O(log N) instead of O(N) ✅

-- Fast composite query
SELECT * FROM AppliedJobs WHERE company = 'Google' AND status = 'Applied';
-- Uses idx_company_status → Very fast ✅

-- Range query
SELECT * FROM AppliedJobs WHERE applied_date BETWEEN '2024-01-01' AND '2024-12-31';
-- Uses idx_applied_date → Fast ✅
```

---

## Key Takeaway

**Indexes** transform database searches from **O(N) scanning** to **O(log N) or O(1) direct access**, just like how knowing the structure of our array (sequential numbers) allowed us to calculate the index directly instead of scanning!

**Answer to the question**: The database feature that starts with "I" is **INDEX** (or INDEXING).

---

## Visual Comparison

```
Without Index (O(N)):
Database → [Row 1] → [Row 2] → [Row 3] → ... → [Row 99,999] → [Row 100,000] ❌
           Check    Check     Check           Check           FOUND!

With Index (O(log N)):
Database → Index → [Navigate Tree: 17 comparisons] → FOUND! ✅

With Hash Index (O(1)):
Database → Index → [Hash Function] → FOUND! ✅✅
```
