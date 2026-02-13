# Task 5 – Backend API Testing

## Assignment

API request testing with API key

**Main Task:** Write a simple test that verifies the author of a book with ISBN: `9782842604103` is **William Shakespeare**.

**Requirements:**
- Authorization using API KEY
- Comparison of expected and received JSON

**Technologies:** Jest + Axios

**Bonus Task:** Find another publicly available API and write your own creative API test.

---

## Project Structure

```
task5/
├── tests/
│   ├── googleBooks.test.js       # Main task – Google Books API
│   └── OpenLibrary.test.js       # Bonus task – Open Library API
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** version **18.0.0 or higher** (recommended v20.x LTS)

Verify your version:
```bash
node --version
```

## Installation

```bash
cd task5
npm install
```

## API Key Configuration (Google Books)

Google Books API supports calls without an API key for basic queries, but this task requires authorization using an API KEY.

### Getting an API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable **Books API** in APIs & Services → Library
4. Create an API key in APIs & Services → Credentials

### Setting Up the Key:

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and replace `YOUR_API_KEY_HERE` with your actual API key:
```
GOOGLE_BOOKS_API_KEY=your-actual-api-key
```

> ⚠️ **Important:** The `.env` file is in `.gitignore` and will not be committed to the repository. Never share your API key!

> **Note:** Tests work without an API key (Google Books API allows it for simple queries), but it's recommended to set the key to meet the task requirements.

## Running Tests

### All tests
```bash
npm test
```

### Google Books tests only (main task)
```bash
npm run test:books
```

### Bonus tests only (Open Library API)
```bash
npm run test:OpenLib
```

## Test Descriptions

### 1. Google Books API (`googleBooks.test.js`)

The main test verifies:
- ✅ HTTP response is 200
- ✅ Response contains `kind: "books#volumes"`
- ✅ Exactly 1 result is returned for the given ISBN
- ✅ **The author of the book with ISBN 9782842604103 is William Shakespeare**
- ✅ Comparison of expected and received JSON (structure + values)
- ✅ ISBN-13 identifier matches the queried ISBN
- ✅ Book has a non-empty title
- ✅ Print type is "BOOK"

### 2. Open Library API (`OpenLibrary.test.js`) – Bonus

Creative tests for the public Open Library API:

**ISBN Lookup:**
- ✅ Verification of "Animal Farm" book by ISBN
- ✅ Checking publication date and page count
- ✅ Verification of 404 for non-existent ISBN

**Author Search:**
- ✅ Finding William Shakespeare
- ✅ Verification that Shakespeare is in top results
- ✅ Checking work count (> 100)

**Book Search:**
- ✅ Keyword search for "hamlet shakespeare"
- ✅ Verification of results and their structure
- ✅ Checking identifiers

## Expected Output

```
 PASS  tests/googleBooks.test.js
  Google Books API – ISBN Lookup
    ✓ should return HTTP 200
    ✓ should return kind "books#volumes"
    ✓ should return exactly 1 result for the given ISBN
    ✓ should have "William Shakespeare" as the author of ISBN 9782842604103
    ✓ should match expected book JSON structure
    ✓ should contain ISBN-13 identifier matching the queried ISBN
    ✓ should have a non-empty title
    ✓ should have printType "BOOK"

 PASS  tests/OpenLibrary.test.js
  Bonus: Open Library API Tests
    ISBN Lookup
      ✓ should return HTTP 200 for a valid ISBN
      ✓ should return the correct book title "Animal Farm"
      ✓ should have a publish date
      ✓ should have a number of pages
      ✓ should return 404 for a non-existent ISBN
    Author Search
      ✓ should find results for "William Shakespeare"
      ✓ should have William Shakespeare in the top results
      ✓ should return Shakespeare with a high work count
    Book Search
      ✓ should return results for "hamlet shakespeare"
      ✓ should have "Hamlet" in at least one result title
      ✓ should include author_name in results
      ✓ each result should have a key identifier

Test Suites:  2 passed, 2 total
Tests:        20 passed, 20 total
```
