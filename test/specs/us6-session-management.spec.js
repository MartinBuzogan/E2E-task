const LoginPage = require('../pageobjects/LoginPage');
const HomePage = require('../pageobjects/HomePage');
const MyPage = require('../pageobjects/MyPage');
const PlansPage = require('../pageobjects/PlansPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US6 - Session Management and Logout', () => {

    it('6.1 - Should logout successfully', async () => {
        const user = testData.users.clark;

        logger.step(1, 'Login as clark');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Verify logged-in state - Logout is visible');
        const isLoggedIn = await HomePage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        logger.step(3, 'Click Logout');
        await HomePage.logout();

        logger.step(4, 'Verify redirected to home/login page');
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('index.html') || url.endsWith('/en-US/');
            },
            { timeout: 10000 }
        );

        logger.step(5, 'Verify navigation shows Login, not Logout');
        const isLoginVisible = await HomePage.isLoginLinkVisible();
        expect(isLoginVisible).toBe(true);

        const isLogoutVisible = await HomePage.isLogoutLinkVisible();
        expect(isLogoutVisible).toBe(false);
    });

    it('6.2 - Should persist session during navigation', async () => {
        const user = testData.users.diana;

        logger.step(1, 'Login as diana');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Navigate to Plans page');
        await PlansPage.open();
        let isLoggedIn = await PlansPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        logger.step(3, 'Refresh the page');
        await browser.refresh();
        await browser.pause(1000);
        isLoggedIn = await PlansPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        logger.step(4, 'Navigate to My Page');
        await MyPage.open();
        isLoggedIn = await MyPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        logger.step(5, 'Verify My Page shows user data');
        const profile = await MyPage.getProfileData();
        expect(profile.email).toBe(user.email);
    });

    it('6.3 - Should deny access to protected page after logout', async () => {
        const user = testData.users.clark;

        logger.step(1, 'Login');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Logout');
        await HomePage.logout();
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('index.html') || url.endsWith('/en-US/');
            },
            { timeout: 10000 }
        );

        logger.step(3, 'Verify logged out on home page');
        const isLoggedOut = !(await HomePage.isLoggedIn());
        expect(isLoggedOut).toBe(true);

        logger.step(4, 'Attempt to access My Page directly');
        await MyPage.open();
        await browser.pause(2000);

        logger.step(5, 'Verify no personal user data is displayed');
        const url = await browser.getUrl();
        const isOnLoginPage = url.includes('login.html');
        
        const emailElement = await $('#email');
        const emailExists = await emailElement.isExisting();
        if (isOnLoginPage) {
            expect(url).toContain('login.html');
        } else {
            expect(emailExists).toBe(false);
        }
    });
});
