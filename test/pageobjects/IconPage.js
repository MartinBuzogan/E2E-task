const path = require('path');
const BasePage = require('./BasePage');
const logger = require('../helpers/logger');

class IconPage extends BasePage {
    get inputIcon() { return $('#icon'); }
    get inputZoom() { return $('#zoom'); }
    get inputColor() { return $('#color'); }
    get btnSubmit() { return $('#icon-form button[type="submit"]'); }
    get iconHolder() { return $('#icon-holder'); }

    async open() {
        await super.open('icon.html');
    }

    async uploadIcon(relativePath) {
        const filePath = path.resolve(relativePath);
        logger.info(`Uploading icon: ${filePath}`);
        const fileInput = await this.inputIcon;
        await fileInput.setValue(filePath);
    }

    async submit() {
        logger.info('Submitting icon form');
        const btn = await this.btnSubmit;
        await btn.click();
    }

    async getIconImage() {
        const holder = await this.iconHolder;
        const img = await holder.$('img');
        return img;
    }
}

module.exports = new IconPage();
