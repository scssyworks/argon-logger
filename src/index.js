import './polyfills/includes';
import './polyfills/find';
import { isArr, toArr, assign } from './utils';

/**
 * Tests if current host name matches allowed hostnames
 * @param {string} hostname Current hostname
 * @param {object} config Configuration
 */
function matchesURL(hostname, config) {
    const allowedHostnames = isArr(config.allowedHostnames) ? config.allowedHostnames : [];
    return (allowedHostnames.length === 0 || !!allowedHostnames.find(URL => (URL.includes(hostname))));
}

/**
 * Checks if given port is allowed
 * @param {string} port Current port
 * @param {object} config Configuration
 */
function matchesPort(port, config) {
    let allowedPorts = isArr(config.allowedPorts) ? config.allowedPorts : [];
    allowedPorts = allowedPorts.map(port => (`${port}`).trim());
    return (allowedPorts.length === 0 || allowedPorts.includes(port));
}

/**
 * Returns a map of query string key value pairs
 * @param {string} queryString Current query string
 */
function getAllParams(queryString) {
    queryString = queryString.substring(queryString.charAt(0) === '?');
    return queryString.split('&').map(pairs => {
        const pair = pairs.split('=').map(part => decodeURIComponent(part).trim());
        return { key: pair[0], value: pair[1] };
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
    const allowedQueryStringParameters = isArr(config.allowedQueryStringParameters) ? config.allowedQueryStringParameters : [];
    const allParams = getAllParams(queryString);
    const allowedParams = [];
    allowedQueryStringParameters.forEach(param => {
        if (typeof param === 'string') {
            const pair = param.split('=');
            allowedParams.push({ key: pair[0], value: typeof pair[1] === 'undefined' ? true : pair[1] });
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
        const currentResult = !!allParams.find(queryParam => (
            param.key === queryParam.key
            && (param.value === queryParam.value || param.value === true)
        ));
        result = result || currentResult;
    });
    return result;
}

/**
 * Returns true if logging should allowed
 */
function isLoggingAllowed() {
    const test = this.config.test;
    const disable = this.config.disable;
    const location = this.location;
    if (typeof test === 'function') {
        return test.apply(this.config, arguments);
    }
    return (
        (typeof console !== 'undefined')
        && (
            (
                matchesURL(location.hostname, this.config)
                && matchesPort(location.port, this.config)
            )
            || matchesQueryParam(location.search, this.config)
        )
        && !disable
    );
}

function rewireFunc() {
    const args = toArr(arguments);
    const fn = args.splice(0, 1)[0];
    const prefixes = this.config.prefixes;
    while (prefixes.length) {
        args.unshift(prefixes.pop());
    }
    if (this.isLoggingAllowed(args) && console[fn]) {
        let c;
        return (c = console)[fn].apply(c, args);
    }
    return;
}

/**
 * Returns concatenation of function name and arguments array
 * @param {string} fn Function name
 * @param {any[]} args Arguments array
 */
function getArgs(fn, args) {
    return [fn].concat(toArr(args));
}

/**
 * Logger class
 * @class
 */
export default class Logger {
    constructor(config) {
        config = config || {};
        this.config = Object.freeze(assign({
            allowedHostnames: ['localhost', '127.0.0.1', '0.0.0.0'],
            disable: false,
            allowedQueryStringParameters: ['debug'],
            allowedPorts: [],
            prefixes: []
        }, config));
        this.location = typeof window === 'undefined' ? {} : window.location;
        this.URL = this.location.href;
    }
    isLoggingAllowed(args) {
        return isLoggingAllowed.apply(this, args);
    }
    log() {
        return rewireFunc.apply(this, getArgs('log', arguments));
    }
    warn() {
        return rewireFunc.apply(this, getArgs('warn', arguments));
    }
    debug() {
        return rewireFunc.apply(this, getArgs('debug', arguments));
    }
    error() {
        return rewireFunc.apply(this, getArgs('error', arguments));
    }
    info() {
        return rewireFunc.apply(this, getArgs('info', arguments));
    }
    dir() {
        return rewireFunc.apply(this, getArgs('dir', arguments));
    }
    dirxml() {
        return rewireFunc.apply(this, getArgs('dirxml', arguments));
    }
    table() {
        return rewireFunc.apply(this, getArgs('table', arguments));
    }
    trace() {
        return rewireFunc.apply(this, getArgs('trace', arguments));
    }
    group() {
        return rewireFunc.apply(this, getArgs('group', arguments));
    }
    groupCollapsed() {
        return rewireFunc.apply(this, getArgs('groupCollapsed', arguments));
    }
    groupEnd() {
        return rewireFunc.apply(this, getArgs('groupEnd', arguments));
    }
    clear() {
        return rewireFunc.apply(this, getArgs('clear', arguments));
    }
    count() {
        return rewireFunc.apply(this, getArgs('count', arguments));
    }
    countReset() {
        return rewireFunc.apply(this, getArgs('countReset', arguments));
    }
    assert() {
        return rewireFunc.apply(this, getArgs('assert', arguments));
    }
    profile() {
        return rewireFunc.apply(this, getArgs('profile', arguments));
    }
    profileEnd() {
        return rewireFunc.apply(this, getArgs('profileEnd', arguments));
    }
    time() {
        return rewireFunc.apply(this, getArgs('time', arguments));
    }
    timeLog() {
        return rewireFunc.apply(this, getArgs('timeLog', arguments));
    }
    timeStamp() {
        return rewireFunc.apply(this, getArgs('timeStamp', arguments));
    }
    context() {
        return rewireFunc.apply(this, getArgs('context', arguments));
    }
}