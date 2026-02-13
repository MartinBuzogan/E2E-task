const SignupPage = require('../pageobjects/SignupPage');
const MyPage = require('../pageobjects/MyPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US1 - User Registration', () => {

    it('1.1 - Should register a new user with valid data', async () => {
        logger.step(1, 'Navigate to sign-up page');
        await SignupPage.open();

        logger.step(2, 'Fill in registration form with valid data');
        await SignupPage.signup(testData.newUser);

        logger.step(3, 'Verify redirect to My Page');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000, timeoutMsg: 'Was not redirected to My Page after signup' }
        );

        logger.step(4, 'Verify profile data on My Page');
        const profile = await MyPage.getProfileData();
        expect(profile.email).toBe(testData.newUser.email);
        expect(profile.username).toBe(testData.newUser.username);
        expect(profile.rank.toLowerCase()).toContain('premium');

        logger.step(5, 'Verify data stored in Local Storage');
        const storedData = await browser.execute(() => {
            return window.localStorage.length > 0;
        });
        expect(storedData).toBe(true);
    });

    it('1.2 - Should show validation error for invalid email format', async () => {
        logger.step(1, 'Navigate to sign-up page');
        await SignupPage.open();

        logger.step(2, 'Fill form with invalid email');
        await SignupPage.signup(testData.invalidEmailUser);

        logger.step(3, 'Verify form is not submitted - still on signup page');
        const url = await browser.getUrl();
        expect(url).toContain('signup.html');

        logger.step(4, 'Verify email validation error exists');
        const isInvalid = await SignupPage.isEmailInvalid();
        expect(isInvalid).toBe(true);
    });
});
