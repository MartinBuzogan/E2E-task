const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class ReservePage extends BasePage {
    get inputDate() { return $('#date'); }
    get inputTerm() { return $('#term'); }
    get inputHeadCount() { return $('#head-count'); }
    get checkBreakfast() { return $('#breakfast'); }
    get checkEarlyCheckIn() { return $('#early-check-in'); }
    get checkSightseeing() { return $('#sightseeing'); }
    get inputUsername() { return $('#username'); }
    get selectContact() { return $('#contact'); }
    get inputEmail() { return $('#email'); }
    get inputTel() { return $('#tel'); }
    get inputComment() { return $('#comment'); }
    get totalBill() { return $('#total-bill'); }
    get btnSubmit() { return $('#submit-button'); }
    get headCountMessage() { return $('#head-count ~ .invalid-feedback'); }
    get planName() { return $('#plan-name'); }
    get roomBill() { return $('#room-bill'); }

    async switchToReserveWindow() {
        logger.info('Switching to reservation window');
        await browser.pause(2000);
        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[handles.length - 1]);
        await this.inputDate.waitForDisplayed({ timeout: 10000 });
    }

    async setDate(dateString) {
        logger.info(`Setting check-in date: ${dateString}`);
        const dateInput = await this.inputDate;
        await dateInput.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        await dateInput.setValue(dateString);
        await browser.keys('Tab');
    }

    async setTerm(nights) {
        logger.info(`Setting term: ${nights} nights`);
        const termInput = await this.inputTerm;
        await termInput.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        await termInput.setValue(nights.toString());
        await browser.keys('Tab');
    }

    async setHeadCount(count) {
        logger.info(`Setting head count: ${count}`);
        const headInput = await this.inputHeadCount;
        await headInput.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        await headInput.setValue(count.toString());
        await browser.keys('Tab');
    }

    async setUsername(name) {
        logger.info(`Setting username: ${name}`);
        const usernameInput = await this.inputUsername;
        await usernameInput.click();
        await browser.keys(['Control', 'a']);
        await browser.keys('Delete');
        await usernameInput.setValue(name);
    }

    async setContact(type) {
        logger.info(`Setting contact: ${type}`);
        await this.selectContact.selectByAttribute('value', type);
    }

    async setEmail(email) {
        await this.inputEmail.setValue(email);
    }

    async setTel(tel) {
        await this.inputTel.setValue(tel);
    }

    async getTotalBill() {
        const bill = await this.totalBill;
        return await bill.getText();
    }

    async submit() {
        logger.info('Submitting reservation');
        const btn = await this.btnSubmit;
        await btn.click();
    }

    async getHeadCountValidationError() {
        const headInput = await this.inputHeadCount;
        return await browser.execute((el) => el.validationMessage, headInput);
    }
}

module.exports = new ReservePage();
