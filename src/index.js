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
            ...config
        });
        this.location = typeof window === 'undefined' ? {} : window.location;
        this.URL = this.location.href;
    }
}

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
    let result = true;
    allowedParams.forEach(param => {
        const currentResult = !!allParams.filter(queryParam => (
            param.key === queryParam.key
            && (param.value === queryParam.value || param.value === true)
        )).length;
        result = result && currentResult;
    });
    return result;
}

// Extending current Logger class to include all console methods
if (typeof console !== 'undefined') {
    Object.keys(console).forEach(prop => {
        if (typeof console[prop] === 'function') {
            Logger.prototype[prop] = function (...args) {
                if (
                    (matchesURL(this.location.hostname, this.config) || matchesQueryParam(this.location.search, this.config))
                    && !this.config.disable
                ) {
                    console[prop](...args);
                }
            };
        } else {
            Logger.prototype[prop] = console[prop];
        }
    });
}