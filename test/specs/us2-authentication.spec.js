const LoginPage = require('../pageobjects/LoginPage');
const MyPage = require('../pageobjects/MyPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US2 - User Authentication', () => {

    it('2.1 - Should login successfully with preset user credentials', async () => {
        const user = testData.users.clark;

        logger.step(1, 'Navigate to login page');
        await LoginPage.open();

        logger.step(2, 'Enter valid credentials and login');
        await LoginPage.login(user.email, user.password);

        logger.step(3, 'Verify redirect to My Page');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000, timeoutMsg: 'Was not redirected to My Page after login' }
        );

        logger.step(4, 'Verify user information displayed on My Page');
        const profile = await MyPage.getProfileData();
        expect(profile.email).toBe(user.email);

        logger.step(5, 'Verify session cookie is created');
        const cookies = await browser.getCookies();
        expect(cookies.length).toBeGreaterThan(0);

        logger.step(6, 'Verify navigation shows Logout option');
        const isLoggedIn = await LoginPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);
    });

    it('2.2 - Should show error for invalid credentials', async () => {
        logger.step(1, 'Navigate to login page');
        await LoginPage.open();

        logger.step(2, 'Enter invalid credentials');
        await LoginPage.login('wronguser@example.com', 'wrongpassword');

        logger.step(3, 'Verify error message is displayed');
        const emailMsg = await $('#email-message');
        const passwordMsg = await $('#password-message');
        await browser.waitUntil(
            async () => (await emailMsg.isDisplayed()) || (await passwordMsg.isDisplayed()),
            { timeout: 5000, timeoutMsg: 'Error message did not appear after invalid login' }
        );
        const errorMsg = await LoginPage.getErrorMessage();
        expect(errorMsg).toContain('Email or password is invalid');

        logger.step(4, 'Verify user remains on login page');
        const url = await browser.getUrl();
        expect(url).toContain('login.html');
    });
});
