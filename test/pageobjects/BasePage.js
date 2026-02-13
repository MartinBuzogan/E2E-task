const logger = require('../helpers/logger');

class BasePage {
    get navHome() { return $('a.nav-link[href="./index.html"]'); }
    get navReserve() { return $('a.nav-link[href="./plans.html"]'); }
    get logoutForm() { return $('#logout-form'); }
    get logoutButton() { return $('#logout-form button[type="submit"]'); }
    get loginLink() { return $('a[href="./login.html"]'); }
    get mypageLink() { return $('a[href="./mypage.html"]'); }
    get signupLink() { return $('a[href="./signup.html"]'); }

    async open(path) {
        logger.info(`Navigating to: ${path}`);
        await browser.url(`${browser.options.baseUrl}/${path}`);
    }

    async isLoggedIn() {
        const logoutForm = await this.logoutForm;
        if (!(await logoutForm.isExisting())) {
            return false;
        }
        return await logoutForm.isDisplayed();
    }

    async logout() {
        logger.info('Logging out...');
        const logoutBtn = await this.logoutButton;
        await logoutBtn.waitForClickable({ timeout: 5000 });
        await logoutBtn.click();
    }

    async waitForPageLoad() {
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete',
            { timeout: 10000 }
        );
    }
}

module.exports = BasePage;
