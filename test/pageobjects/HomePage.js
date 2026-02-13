const BasePage = require('./BasePage');

class HomePage extends BasePage {
    get loginHolder() { return $('#login-holder'); }
    get logoutHolder() { return $('#logout-holder'); }
    get mypageHolder() { return $('#mypage-holder'); }

    async open() {
        await super.open('index.html');
    }

    async isLoginLinkVisible() {
        const holder = await this.loginHolder;
        if (!(await holder.isExisting())) {
            // On pages without holders, check for login link
            const link = await this.loginLink;
            return await link.isExisting();
        }
        const classAttr = await holder.getAttribute('class');
        return classAttr.includes('d-block') || !classAttr.includes('d-none');
    }

    async isLogoutLinkVisible() {
        const holder = await this.logoutHolder;
        if (!(await holder.isExisting())) {
            // On pages without holders, check for logout form
            return await this.isLoggedIn();
        }
        const classAttr = await holder.getAttribute('class');
        return !classAttr.includes('d-none');
    }

    async isMypageLinkVisible() {
        const holder = await this.mypageHolder;
        if (!(await holder.isExisting())) {
            const link = await this.mypageLink;
            return await link.isExisting();
        }
        const classAttr = await holder.getAttribute('class');
        return !classAttr.includes('d-none');
    }
}

module.exports = new HomePage();
