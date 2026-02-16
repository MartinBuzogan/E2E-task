const { config } = require('./wdio.conf.js');

const selectedBrowser = (process.env.BROWSER || 'chrome').toLowerCase();

function getSequentialCapabilities(browser) {
    switch (browser) {
        case 'firefox':
            return {
                browserName: 'firefox',
                'moz:firefoxOptions': {
                    args: ['--width=1920', '--height=1080']
                }
            };
        case 'edge':
            return {
                browserName: 'MicrosoftEdge',
                'ms:edgeOptions': {
                    args: ['--disable-gpu', '--window-size=1920,1080', '--no-sandbox']
                }
            };
        case 'chrome':
        default:
            return {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: ['--disable-gpu', '--window-size=1920,1080', '--no-sandbox']
                }
            };
    }
}

exports.config = {
    ...config,
    maxInstances: 1,
    capabilities: [getSequentialCapabilities(selectedBrowser)]
};