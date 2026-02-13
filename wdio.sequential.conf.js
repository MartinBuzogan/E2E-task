const { config } = require('./wdio.conf.js');

exports.config = {
    ...config,
    maxInstances: 1,
    capabilities: [{
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
            args: ['--disable-gpu', '--window-size=1920,1080', '--no-sandbox']
        }
    }]
};