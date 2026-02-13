const axios = require('axios');
const fs = require('fs');
const path = require('path');
//load .env variables APIkey
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...rest] = trimmed.split('=');
            process.env[key.trim()] = rest.join('=').trim();
        }
    });
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Google Books API key – loaded from .env file or environment variable
// Copy .env.example to .env and add your key there.
// Get your key at: https://console.cloud.google.com/apis/credentials
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';

const ISBN = '9782842604103';
const EXPECTED_AUTHOR = 'William Shakespeare';

// ---------------------------------------------------------------------------
// Expected JSON structure (subset) returned by Google Books API for this ISBN
// ---------------------------------------------------------------------------
const expectedBookData = {
    title: 'Hamlet',
    authors: [EXPECTED_AUTHOR],
    industryIdentifiers: expect.arrayContaining([
        expect.objectContaining({
            type: 'ISBN_13',
            identifier: ISBN
        })
    ])
};

// ---------------------------------------------------------------------------
// Helper – build request params
// ---------------------------------------------------------------------------
let validatedApiKey = null;

function buildParams(isbn, apiKey) {
    const params = { q: `isbn:${isbn}` };
    if (apiKey){
        params.key = apiKey; 
    }   
    return params;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Google Books API ISBN Lookup', () => {

    let statusCode;
    let responseData;
    let volumeInfo;

    // Fetch data once before all tests in this suite
    beforeAll(async () => {
        const response = await axios.get(BASE_URL, {
            params: buildParams(ISBN, API_KEY)
        });
        statusCode = response.status;
        responseData = response.data;
        volumeInfo = response.data.items[0].volumeInfo;
    });

    // ------ Basic response checks ------
    test('should have a valid API KEY configured', () => {
        expect(API_KEY).toBeTruthy();
        expect(API_KEY).not.toBe('YOUR_API_KEY_HERE');
    });

    test('should return HTTP 200', () => {
        expect(statusCode).toBe(200);
    });

    test('should return kind "books#volumes"', () => {
        expect(responseData.kind).toBe('books#volumes');
    });

    test('should return exactly 1 result for the given ISBN', () => {
        expect(responseData.totalItems).toBe(1);
        expect(responseData.items).toHaveLength(1);
    });

    // ------ Author verification (main requirement) ------

    test(`should have "${EXPECTED_AUTHOR}" as the author of ISBN ${ISBN}`, () => {
        expect(volumeInfo.authors).toBeDefined();
        expect(volumeInfo.authors).toContain(EXPECTED_AUTHOR);
    });

    // ------ JSON comparison (requirement: compare expected vs received) ------

    test('should match expected book JSON structure', () => {
        expect(volumeInfo).toEqual(expect.objectContaining(expectedBookData));
    });

    // ------ Additional property checks ------

    test('should contain ISBN-13 identifier matching the queried ISBN', () => {
        const isbn13 = volumeInfo.industryIdentifiers.find(
            id => id.type === 'ISBN_13'
        );
        expect(isbn13).toBeDefined();
        expect(isbn13.identifier).toBe(ISBN);
    });

    test('should have a non-empty title', () => {
        expect(volumeInfo.title).toBeTruthy();
        expect(typeof volumeInfo.title).toBe('string');
    });

    test('should have printType "BOOK"', () => {
        expect(volumeInfo.printType).toBe('BOOK');
    });
});
