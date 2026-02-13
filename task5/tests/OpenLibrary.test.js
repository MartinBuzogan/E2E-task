const axios = require('axios');

const BASE_URL = 'https://openlibrary.org';

describe('Bonus: Open Library API Tests', () => {

    // -----------------------------------------------------------------------
    // 1. ISBN Lookup – Cross-reference with Google Books
    // -----------------------------------------------------------------------
    describe('ISBN Lookup', () => {

        let bookData;

        beforeAll(async () => {
            const response = await axios.get(`${BASE_URL}/isbn/9780451526342.json`);
            bookData = response.data;
        });

        test('should return HTTP 200 for a valid ISBN', async () => {
            const response = await axios.get(`${BASE_URL}/isbn/9780451526342.json`);
            expect(response.status).toBe(200);
        });

        test('should return the correct book title "Animal Farm"', () => {
            expect(bookData.title).toBe('Animal Farm');
        });

        test('should have a publish date', () => {
            expect(bookData.publish_date).toBeDefined();
            expect(typeof bookData.publish_date).toBe('string');
        });

        test('should have a number of pages', () => {
            expect(bookData.number_of_pages).toBeDefined();
            expect(typeof bookData.number_of_pages).toBe('number');
        });

        test('should return 404 for a non-existent ISBN', async () => {
            try {
                await axios.get(`${BASE_URL}/isbn/0000000000000.json`);
                fail('Expected 404 error');
            } catch (error) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    // -----------------------------------------------------------------------
    // 2. Author Search – William Shakespeare
    // -----------------------------------------------------------------------
    describe('Author Search', () => {

        let searchData;

        beforeAll(async () => {
            const response = await axios.get(`${BASE_URL}/search/authors.json`, {
                params: { q: 'William Shakespeare' }
            });
            searchData = response.data;
        });

        test('should find results for "William Shakespeare"', () => {
            expect(searchData.numFound).toBeGreaterThan(0);
        });

        test('should have William Shakespeare in the top results', () => {
            const names = searchData.docs.map(doc => doc.name);
            expect(names).toContain('William Shakespeare');
        });

        test('should return Shakespeare with a high work count', () => {
            const shakespeare = searchData.docs.find(
                doc => doc.name === 'William Shakespeare'
            );
            expect(shakespeare).toBeDefined();
            expect(shakespeare.work_count).toBeGreaterThan(100);
        });
    });

    // -----------------------------------------------------------------------
    // 3. Search API – Keyword Search
    // -----------------------------------------------------------------------
    describe('Book Search', () => {

        let searchResults;

        beforeAll(async () => {
            const response = await axios.get(`${BASE_URL}/search.json`, {
                params: {
                    q: 'hamlet shakespeare',
                    limit: 5
                }
            });
            searchResults = response.data;
        });

        test('should return results for "hamlet shakespeare"', () => {
            expect(searchResults.numFound).toBeGreaterThan(0);
            expect(searchResults.docs).toBeDefined();
            expect(searchResults.docs.length).toBeGreaterThan(0);
        });

        test('should have "Hamlet" in at least one result title', () => {
            const titles = searchResults.docs.map(doc => doc.title.toLowerCase());
            const hasHamlet = titles.some(title => title.includes('hamlet'));
            expect(hasHamlet).toBe(true);
        });

        test('should include author_name in results', () => {
            const firstResult = searchResults.docs[0];
            expect(firstResult.author_name).toBeDefined();
            expect(Array.isArray(firstResult.author_name)).toBe(true);
        });

        test('each result should have a key identifier', () => {
            searchResults.docs.forEach(doc => {
                expect(doc.key).toBeDefined();
                expect(typeof doc.key).toBe('string');
            });
        });
    });
});
