/**
 * Tests if current host name matches allowed hostnames
 * @param {string} hostname Current hostname
 * @param {object} config Configuration
 */
function matchesURL(hostname, config) {
    const allowedHostnames = Array.isArray(config.allowedHostnames) ? config.allowedHostnames : [];
    if (allowedHostnames.length === 0) {
        return true;
    }
    return !!allowedHostnames.filter(URL => (URL.indexOf(hostname) > -1)).length;
}

/**
 * Checks if given port is allowed
 * @param {string} port Current port
 * @param {object} config Configuration
 */
function matchesPort(port, config) {
    let allowedPorts = Array.isArray(config.allowedPorts) ? config.allowedPorts : [];
    allowedPorts = allowedPorts.map(port => (`${port}`).trim());
    if (allowedPorts.length === 0) {
        return true;
    }
    return (allowedPorts.indexOf(port) > -1);
}

/**
 * Returns a map of query string key value pairs
 * @param {string} queryString Current query string
 */
function getAllParams(queryString) {
    queryString = queryString.substring(queryString.charAt(0) === '?' ? 1 : 0);
    return queryString.split('&').map((pairs) => {
        const [key, value] = pairs.split('=').map(part => decodeURIComponent(part).trim());
        return { key, value };
    });
}

/**
 * Alias for hasOwnProperty
 * @param {object} object Target object
 * @param {string} key Key name
 */
function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Tests if any existing query parameter matches configuration
 * @param {string} queryString Query string
 * @param {object} config Configuration
 */
function matchesQueryParam(queryString, config) {
    const allowedQueryStringParameters = Array.isArray(config.allowedQueryStringParameters) ? config.allowedQueryStringParameters : [];
    const allParams = getAllParams(queryString);
    const allowedParams = [];
    allowedQueryStringParameters.forEach(param => {
        if (typeof param === 'string') {
            const [key, value = true] = param.split('=');
            allowedParams.push({ key, value });
        } else if (
            param
            && typeof param === 'object'
            && hasOwn(param, 'key')
            && hasOwn(param, 'value') // Schema check
        ) {
            param.key = param.key.trim();
            param.value = (`${param.value}`).trim();
            allowedParams.push(param);
        }
    });
    let result = false;
    allowedParams.forEach(param => {
        const currentResult = !!allParams.filter(queryParam => (
            param.key === queryParam.key
            && (param.value === queryParam.value || param.value === true)
        )).length;
        result = result || currentResult;
    });
    return result;
}

/**
 * Returns true if logging should allowed
 */
function isLoggingAllowed(...args) {
    if (typeof this.config.test === 'function') {
        return this.config.test.apply(this.config, args);
    }
    return (
        (typeof console !== 'undefined')
        && (
            (
                matchesURL(this.location.hostname, this.config)
                && matchesPort(this.location.port, this.config)
            )
            || matchesQueryParam(this.location.search, this.config)
        )
        && !this.config.disable
    );
}

/**
 * Logger class
 * @class
 */
export default class Logger {
    constructor(config = {}) {
        this.config = Object.freeze({
            allowedHostnames: ['localhost', '127.0.0.1', '0.0.0.0'],
            disable: false,
            allowedQueryStringParameters: ['debug'],
            allowedPorts: [],
            prefixes: [],
            ...config
        });
        this.location = typeof window === 'undefined' ? {} : window.location;
        this.URL = this.location.href;
    }
    isLoggingAllowed(args) {
        return isLoggingAllowed.apply(this, args);
    }
    log() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.log) {
            return console.log(...args);
        }
    }
    warn() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.warn) {
            console.warn(...args);
        }
    }
    debug() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.debug) {
            console.debug(...args);
        }
    }
    error() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.error) {
            console.error(...args);
        }
    }
    info() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.info) {
            console.info(...args);
        }
    }
    dir() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.dir) {
            console.dir(...args);
        }
    }
    dirxml() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.dirxml) {
            console.dirxml(...args);
        }
    }
    table() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.table) {
            console.table(...args);
        }
    }
    trace() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.trace) {
            console.trace(...args);
        }
    }
    group() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.group) {
            console.group(...args);
        }
    }
    groupCollapsed() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.groupCollapsed) {
            console.groupCollapsed(...args);
        }
    }
    groupEnd() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.groupEnd) {
            console.groupEnd(...args);
        }
    }
    clear() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.clear) {
            console.clear(...args);
        }
    }
    count() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.count) {
            console.count(...args);
        }
    }
    countReset() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.countReset) {
            console.countReset(...args);
        }
    }
    assert() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.assert) {
            console.assert(...args);
        }
    }
    profile() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.profile) {
            console.profile(...args);
        }
    }
    profileEnd() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.profileEnd) {
            console.profileEnd(...args);
        }
    }
    time() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed() && console.time) {
            console.time(...args);
        }
    }
    timeLog() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.timeLog) {
            console.timeLog(...args);
        }
    }
    timeStamp() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.timeStamp) {
            console.timeStamp(...args);
        }
    }
    context() {
        const args = [...this.config.prefixes, ...arguments];
        if (this.isLoggingAllowed(args) && console.context) {
            console.context(...args);
        }
    }
}