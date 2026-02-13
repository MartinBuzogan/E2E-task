const logger = require('./logger');

async function cleanupBrowser(browserInstance) {
    logger.info('Cleaning up browser state...');

    await browserInstance.url(browserInstance.options.baseUrl + '/index.html');

    await browserInstance.execute(() => {
        window.localStorage.clear();
    });

    await browserInstance.execute(() => {
        window.sessionStorage.clear();
    });

    await browserInstance.deleteCookies();

    logger.info('Browser state cleaned: localStorage, sessionStorage, and cookies cleared.');
}

module.exports = { cleanupBrowser };
