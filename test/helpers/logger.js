const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LOG_LEVELS.INFO;

function timestamp() {
    return new Date().toISOString();
}

const logger = {
    debug(msg) {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            console.log(`[${timestamp()}] [DEBUG] ${msg}`);
        }
    },
    info(msg) {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            console.log(`[${timestamp()}] [INFO]  ${msg}`);
        }
    },
    warn(msg) {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            console.warn(`[${timestamp()}] [WARN]  ${msg}`);
        }
    },
    error(msg) {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            console.error(`[${timestamp()}] [ERROR] ${msg}`);
        }
    },
    step(stepNumber, msg) {
        this.info(`  Step ${stepNumber}: ${msg}`);
    }
};

module.exports = logger;
