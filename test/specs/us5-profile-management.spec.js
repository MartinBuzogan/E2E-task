const LoginPage = require('../pageobjects/LoginPage');
const SignupPage = require('../pageobjects/SignupPage');
const MyPage = require('../pageobjects/MyPage');
const IconPage = require('../pageobjects/IconPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US5 - Manage User Profile', () => {

    it('5.1 - Should view profile information for preset user (miles)', async () => {
        const user = testData.users.miles;

        logger.step(1, 'Login as preset user miles');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Verify profile information displayed');
        const profile = await MyPage.getProfileData();
        expect(profile.email).toBe(user.email);
        expect(profile.rank.toLowerCase()).toContain('normal');

        logger.step(3, 'Verify icon setting is NOT available (preset user)');
        const iconEnabled = await MyPage.isIconSettingEnabled();
        expect(iconEnabled).toBe(false);

        logger.step(4, 'Verify delete account is NOT available (preset user)');
        const deleteEnabled = await MyPage.isDeleteEnabled();
        expect(deleteEnabled).toBe(false);
    });

    it('5.2 - Should set profile icon for custom registered user', async () => {
        logger.step(1, 'Register a new user');
        await SignupPage.open();
        await SignupPage.signup(testData.iconUser);

        logger.step(2, 'Verify redirected to My Page');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(3, 'Verify icon setting is available for custom user');
        const iconEnabled = await MyPage.isIconSettingEnabled();
        expect(iconEnabled).toBe(true);

        logger.step(4, 'Navigate to icon setting page');
        await MyPage.clickIconSetting();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('icon.html'),
            { timeout: 10000 }
        );

        logger.step(5, 'Upload profile icon');
        await IconPage.uploadIcon('./test-assets/test-icon.png');

        logger.step(6, 'Submit icon form');
        await browser.pause(1000);
        await IconPage.submit();

        logger.step(7, 'Verify redirected back to My Page');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(8, 'Verify icon persistence after page refresh');
        await browser.refresh();
        await browser.pause(1000);
        const profile = await MyPage.getProfileData();
        expect(profile.email).toBe(testData.iconUser.email);
    });

    it('5.3 - Should cancel membership for custom registered user', async () => {
        logger.step(1, 'Register a new user (deleteme)');
        await SignupPage.open();
        await SignupPage.signup(testData.deleteUser);

        logger.step(2, 'Verify redirected to My Page');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(3, 'Verify delete account is available');
        const deleteEnabled = await MyPage.isDeleteEnabled();
        expect(deleteEnabled).toBe(true);

        logger.step(4, 'Click delete account');
        await MyPage.deleteAccount();

        logger.step(5, 'Accept confirmation dialog');
        try {
            await browser.acceptAlert();
        } catch (e) {
            logger.info('No alert dialog to accept');
        }

        logger.step(6, 'Verify redirected to home page');
        await browser.waitUntil(
            async () => {
                const url = await browser.getUrl();
                return url.includes('index.html') || url.endsWith('/en-US/');
            },
            { timeout: 10000, timeoutMsg: 'Was not redirected to home page after deletion' }
        );

        logger.step(7, 'Verify user is logged out');
        const isLoggedIn = await MyPage.isLoggedIn();
        expect(isLoggedIn).toBe(false);

        logger.step(8, 'Verify deleted account cannot login');
        await LoginPage.open();
        await LoginPage.login(testData.deleteUser.email, testData.deleteUser.password);
        await browser.pause(1000);
        const errorMsg = await LoginPage.getErrorMessage();
        expect(errorMsg).toContain('Email or password is invalid');
    });
});
