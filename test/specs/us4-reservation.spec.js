const LoginPage = require('../pageobjects/LoginPage');
const PlansPage = require('../pageobjects/PlansPage');
const ReservePage = require('../pageobjects/ReservePage');
const ConfirmPage = require('../pageobjects/ConfirmPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US4 - Make a Hotel Reservation', () => {

    it('4.1 - Should complete a reservation with valid data', async () => {
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
        await PlansPage.waitForPlansToLoad();

        logger.step(3, 'Select a plan and click Reserve');
        const originalWindow = await browser.getWindowHandle();
        await PlansPage.clickReserveOnPlan('Plan with special offers');

        logger.step(4, 'Switch to reservation window');
        await ReservePage.switchToReserveWindow();

        logger.step(5, 'Set check-in date');
        await ReservePage.setDate('03/15/2026');

        logger.step(6, 'Set number of nights to 3');
        await ReservePage.setTerm(3);

        logger.step(7, 'Set number of guests to 2');
        await ReservePage.setHeadCount(2);

        logger.step(8, 'Set guest name');
        await ReservePage.setUsername('Diana Prince');

        logger.step(9, 'Set contact information');
        await ReservePage.setContact('email');
        await browser.pause(500);
        await ReservePage.setEmail(user.email);

        logger.step(10, 'Verify total bill is calculated');
        await browser.pause(1000);
        const totalBill = await ReservePage.getTotalBill();
        expect(totalBill).not.toBe('');

        logger.step(11, 'Submit reservation');
        await ReservePage.submit();

        logger.step(12, 'Verify confirmation page details');
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('confirm.html'),
            { timeout: 10000, timeoutMsg: 'Was not redirected to confirmation page' }
        );

        const details = await ConfirmPage.getConfirmationDetails();
        expect(details.totalBill).not.toBe('');
        expect(details.username).toContain('Diana');

        logger.step(13, 'Click confirm and verify success modal');
        await ConfirmPage.confirm();
        await ConfirmPage.waitForSuccessModal();
        const isModalDisplayed = await ConfirmPage.isSuccessModalDisplayed();
        expect(isModalDisplayed).toBe(true);

        // Close the reservation window and switch back
        await browser.closeWindow();
        await browser.switchToWindow(originalWindow);
    });

    it('4.2 - Should show validation error when exceeding guest capacity', async () => {
        const user = testData.users.diana;

        logger.step(1, 'Login');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Navigate to Plans page');
        await PlansPage.open();
        await PlansPage.waitForPlansToLoad();

        logger.step(3, 'Select a plan with low max occupancy');
        const originalWindow = await browser.getWindowHandle();
        await PlansPage.clickReserveOnPlan('Staying without meals');

        logger.step(4, 'Switch to reservation window');
        await ReservePage.switchToReserveWindow();

        logger.step(5, 'Set dates');
        await ReservePage.setDate('04/01/2026');
        await ReservePage.setTerm(2);

        logger.step(6, 'Set number of guests exceeding capacity (4 for max 2 plan)');
        await ReservePage.setHeadCount(4);

        logger.step(7, 'Fill required fields and submit');
        await ReservePage.setUsername('Diana Prince');
        await ReservePage.setContact('no');
        await ReservePage.submit();

        logger.step(8, 'Verify validation error for head count');
        await browser.pause(500);
        const validationError = await ReservePage.getHeadCountValidationError();
        expect(validationError).not.toBe('');

        logger.step(9, 'Verify form not submitted - still on reserve page');
        const url = await browser.getUrl();
        expect(url).toContain('reserve.html');

        await browser.closeWindow();
        await browser.switchToWindow(originalWindow);
    });
});
