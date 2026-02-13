const { cleanupBrowser } = require('./test/helpers/cleanup');
const logger = require('./test/helpers/logger');
const { ReportAggregator } = require('wdio-html-nice-reporter');

exports.config = {
    runner: 'local',

    specs: ['./test/specs/**/*.spec.js'],

    maxInstances: 4,

    capabilities: [{
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
            args: ['--headless', '--disable-gpu', '--window-size=1920,1080', '--no-sandbox']
        }
    }],

    logLevel: 'warn',
    bail: 0,
    baseUrl: 'https://hotel-example-site.takeyaqa.dev/en-US',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: [],

    framework: 'mocha',
    reporters: [
        ['spec', {
            addConsoleLogs: true,
            realtimeReporting: true
        }],
        ['json', {
            outputDir: './reports/json',
            outputFileFormat: function(options) {
                return `wdio-results-${new Date().toISOString().replace(/:/g, '-')}.json`
            }
        }],
        ['html-nice', {
            outputDir: './reports/html-report/',
            filename: 'report.html',
            reportTitle: 'Test Execution Report',
            linkScreenshots: true,
            showInBrowser: false,
            collapseTests: false,
            useOnAfterCommandForScreenshot: false,
            LOG: {
                level: 'info'
            }
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    beforeTest: async function (test) {
        logger.info(`--- Starting: ${test.title} ---`);
        await cleanupBrowser(browser);
    },

    afterTest: async function (test, context, { error, passed }) {
        if (passed) {
            logger.info(`--- PASSED: ${test.title} ---`);
        } else {
            logger.error(`--- FAILED: ${test.title} ---`);
            if (error) {
                logger.error(`  Error: ${error.message}`);
            }
        }
    },

    onPrepare: function (config, capabilities) {
        this.reportAggregator = new ReportAggregator({
            outputDir: './reports/html-report/',
            filename: 'report.html',
            reportTitle: 'Test Execution Report',
            showInBrowser: false,
            collapseTests: false
        });
        this.reportAggregator.clean();
    },

    onComplete: async function (exitCode, config, capabilities, results) {
        await this.reportAggregator.createReport();
    }
};
