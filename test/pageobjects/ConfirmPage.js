const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class ConfirmPage extends BasePage {
    get totalBill() { return $('#total-bill'); }
    get planName() { return $('#plan-name'); }
    get term() { return $('#term'); }
    get headCount() { return $('#head-count'); }
    get plans() { return $('#plans'); }
    get username() { return $('#username'); }
    get contact() { return $('#contact'); }
    get comment() { return $('#comment'); }
    get btnConfirm() { return $('button[data-toggle="modal"]'); }
    get successModal() { return $('#success-modal'); }
    get closeModalBtn() { return $('#success-modal .btn-success'); }

    async getConfirmationDetails() {
        return {
            totalBill: await (await this.totalBill).getText(),
            planName: await (await this.planName).getText(),
            term: await (await this.term).getText(),
            headCount: await (await this.headCount).getText(),
            username: await (await this.username).getText(),
        };
    }

    async confirm() {
        logger.info('Confirming reservation');
        const btn = await this.btnConfirm;
        await btn.waitForClickable({ timeout: 5000 });
        await btn.click();
    }

    async waitForSuccessModal() {
        logger.info('Waiting for success modal...');
        const modal = await this.successModal;
        await modal.waitForDisplayed({ timeout: 10000 });
    }

    async isSuccessModalDisplayed() {
        const modal = await this.successModal;
        return await modal.isDisplayed();
    }
}

module.exports = new ConfirmPage();
