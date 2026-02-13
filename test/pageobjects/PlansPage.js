const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class PlansPage extends BasePage {
    async open() {
        await super.open('plans.html');
    }

    async waitForPlansToLoad() {
        logger.info('Waiting for plans to load...');
        // Wait for the dynamic plan list to populate
        await browser.waitUntil(
            async () => {
                const cards = await $$('.card');
                return cards.length > 0;
            },
            { timeout: 15000, timeoutMsg: 'Plans did not load within 15 seconds' }
        );
        // Wait for async (Today's Deals) plans to finish loading
        await browser.pause(3000);
    }

    async getAllPlanNames() {
        const titles = await $$('.card-title');
        const names = [];
        for (const title of titles) {
            names.push(await title.getText());
        }
        logger.info(`Found ${names.length} plans: ${names.join(', ')}`);
        return names;
    }

    async getPlanCount() {
        const cards = await $$('.card');
        return cards.length;
    }

    async clickReserveOnPlan(planName) {
        logger.info(`Clicking Reserve on plan: ${planName}`);
        const cards = await $$('.card');
        for (const card of cards) {
            const title = await card.$('.card-title');
            const text = await title.getText();
            if (text.includes(planName)) {
                const reserveBtn = await card.$('a[href*="reserve.html"]');
                await reserveBtn.click();
                return;
            }
        }
        throw new Error(`Plan "${planName}" not found`);
    }

    async getFirstPlanDetails() {
        logger.info('Getting first plan details...');
        const cards = await $$('.card');
        if (cards.length === 0) {
            throw new Error('No plans found on the page');
        }

        const firstCard = cards[0];
        const nameElement = await firstCard.$('.card-title');
        const name = await nameElement.getText();

        let description = '';
        try {
            const allText = await firstCard.getText();
            const cardBody = await firstCard.$('.card-body');
            if (await cardBody.isExisting()) {
                const bodyText = await cardBody.getText();
                description = bodyText.replace(name, '').trim().split('\n')[0];
            }
        } catch (e) {
            logger.info('Could not retrieve description from card');
        }

        let price = '';
        try {
            const elements = await firstCard.$$('*');
            for (const el of elements) {
                const text = await el.getText();
                if (text.includes('$') || text.toLowerCase().includes('price')) {
                    price = text;
                    break;
                }
            }
        } catch (e) {
            logger.info('Price not found');
        }

        let occupancy = '';
        try {
            const elements = await firstCard.$$('*');
            for (const el of elements) {
                const text = await el.getText();
                if (text.toLowerCase().includes('person') || text.toLowerCase().includes('occupancy')) {
                    occupancy = text;
                    break;
                }
            }
        } catch (e) {
            logger.info('Occupancy not found');
        }

        logger.info(`Plan details - Name: ${name}, Description: ${description}, Price: ${price}, Occupancy: ${occupancy}`);

        return {
            name,
            description,
            pricePerNight: price,
            maxOccupancy: occupancy
        };
    }
}

module.exports = new PlansPage();
