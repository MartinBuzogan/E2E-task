const LoginPage = require('../pageobjects/LoginPage');
const PlansPage = require('../pageobjects/PlansPage');
const testData = require('../fixtures/testData');
const logger = require('../helpers/logger');

describe('US3 - Browse and Select Hotel Plans', () => {

    it('3.1 - Premium member should see all plans including premium-exclusive', async () => {
        const user = testData.users.ororo;

        logger.step(1, 'Login as premium member');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Navigate to Plans page');
        await PlansPage.open();

        logger.step(3, 'Wait for all plans to load (including async)');
        await PlansPage.waitForPlansToLoad();

        logger.step(4, 'Get all visible plan names');
        const planNames = await PlansPage.getAllPlanNames();
        const planCount = planNames.length;

        logger.step(5, 'Verify premium-exclusive plans are visible');
        expect(planCount).toBe(testData.premiumMemberPlanCount);

        logger.step(6, 'Verify plan details are displayed');
        expect(planNames.length).toBeGreaterThan(0);
    });

    it('3.2 - Guest should see only guest-available plans', async () => {
        logger.step(1, 'Navigate to Plans page without logging in');
        await PlansPage.open();

        logger.step(2, 'Wait for plans to load');
        await PlansPage.waitForPlansToLoad();

        logger.step(3, 'Get all visible plan names');
        const planNames = await PlansPage.getAllPlanNames();
        const planCount = planNames.length;

        logger.step(4, 'Verify fewer plans visible compared to logged-in members');
        expect(planCount).toBe(testData.guestPlanCount);
        expect(planCount).toBeLessThan(testData.premiumMemberPlanCount);
    });

    it('3.3 - Should display complete plan details: name, description, price, occupancy', async () => {
        const user = testData.users.ororo;

        logger.step(1, 'Login as premium member');
        await LoginPage.open();
        await LoginPage.login(user.email, user.password);
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('mypage.html'),
            { timeout: 10000 }
        );

        logger.step(2, 'Navigate to Plans page');
        await PlansPage.open();

        logger.step(3, 'Wait for plans to load');
        await PlansPage.waitForPlansToLoad();

        logger.step(4, 'Get first plan details');
        const details = await PlansPage.getFirstPlanDetails();

        logger.step(5, 'Verify plan name is displayed');
        expect(details.name).toBeDefined();
        expect(details.name).not.toBe('');

        logger.step(6, 'Verify plan description is displayed');
        expect(details.description).toBeDefined();
        expect(details.description).not.toBe('');

        logger.step(7, 'Verify price per night is displayed');
        expect(details.pricePerNight).toBeDefined();
        expect(details.pricePerNight).not.toBe('');

        logger.step(8, 'Verify maximum occupancy is displayed');
        expect(details.maxOccupancy).toBeDefined();
        expect(details.maxOccupancy).not.toBe('');
    });
});
