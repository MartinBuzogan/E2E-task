const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class MyPage extends BasePage {
    get emailDisplay() { return $('#email'); }
    get usernameDisplay() { return $('#username'); }
    get rankDisplay() { return $('#rank'); }
    get addressDisplay() { return $('#address'); }
    get telDisplay() { return $('#tel'); }
    get genderDisplay() { return $('#gender'); }
    get birthdayDisplay() { return $('#birthday'); }
    get notificationDisplay() { return $('#notification'); }
    get iconLink() { return $('#icon-link'); }
    get deleteForm() { return $('#delete-form'); }
    get deleteButton() { return $('#delete-form button[type="submit"]'); }

    async open() {
        await super.open('mypage.html');
    }

    async getProfileData() {
        return {
            email: await (await this.emailDisplay).getText(),
            username: await (await this.usernameDisplay).getText(),
            rank: await (await this.rankDisplay).getText(),
            address: await (await this.addressDisplay).getText(),
            tel: await (await this.telDisplay).getText(),
        };
    }

    async isIconSettingEnabled() {
        const link = await this.iconLink;
        const classAttr = await link.getAttribute('class');
        const ariaDisabled = await link.getAttribute('aria-disabled');
        return !classAttr.includes('disabled') && ariaDisabled !== 'true';
    }

    async isDeleteEnabled() {
        const btn = await this.deleteButton;
        const isDisabled = await btn.getAttribute('disabled');
        return isDisabled === null;
    }

    async clickIconSetting() {
        logger.info('Clicking Icon Setting link');
        const link = await this.iconLink;
        await link.click();
    }

    async deleteAccount() {
        logger.info('Clicking Delete Account button');
        const btn = await this.deleteButton;
        await btn.click();
    }
}

module.exports = new MyPage();
