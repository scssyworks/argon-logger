/**!
 * A simple console logging utility
 * Released under MIT license
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version v0.3.0
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Logger = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  if (!Array.prototype.includes) {
    Array.prototype.includes = function (el) {
      return this.indexOf(el) > -1;
    };
  }

  if (!Array.prototype.find) {
    Array.prototype.find = function (cb) {
      return this.filter(cb)[0];
    };
  }

  function isObject(ob) {
    return ob && _typeof(ob) === 'object';
  }
  /**
   * Returns true if input is an array
   * @param {any[]} arr Any array
   */


  function isArr(arr) {
    return Array.isArray(arr);
  }
  /**
   * Converts array like object to proper array
   * @param {any[]} arrayLike Array like object
   */

  function toArr(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  }
  /**
   * Inner loop function for assign
   * @private
   * @param {object} ref Argument object
   * @param {object} target First object
   */

  function loopFunc(ref, target) {
    if (isObject(ref)) {
      Object.keys(ref).forEach(function (key) {
        target[key] = ref[key];
      });
    }
  }
  /**
   * Polyfill for Object.assign only smaller and with less features
   * @private
   * @returns {object}
   */


  function assign() {
    var target = isObject(arguments[0]) ? arguments[0] : {};

    for (var i = 1; i < arguments.length; i++) {
      loopFunc(arguments[i], target);
    }

    return target;
  }

  /**
   * Tests if current host name matches allowed hostnames
   * @param {string} hostname Current hostname
   * @param {object} config Configuration
   */

  function matchesURL(hostname, config) {
    var allowedHostnames = isArr(config.allowedHostnames) ? config.allowedHostnames : [];
    return allowedHostnames.length === 0 || !!allowedHostnames.find(function (URL) {
      return URL.includes(hostname);
    });
  }
  /**
   * Checks if given port is allowed
   * @param {string} port Current port
   * @param {object} config Configuration
   */


  function matchesPort(port, config) {
    var allowedPorts = isArr(config.allowedPorts) ? config.allowedPorts : [];
    allowedPorts = allowedPorts.map(function (port) {
      return "".concat(port).trim();
    });
    return allowedPorts.length === 0 || allowedPorts.includes(port);
  }
  /**
   * Returns a map of query string key value pairs
   * @param {string} queryString Current query string
   */


  function getAllParams(queryString) {
    queryString = queryString.substring(queryString.charAt(0) === '?');
    return queryString.split('&').map(function (pairs) {
      var pair = pairs.split('=').map(function (part) {
        return decodeURIComponent(part).trim();
      });
      return {
        key: pair[0],
        value: pair[1]
      };
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
    var allowedQueryStringParameters = isArr(config.allowedQueryStringParameters) ? config.allowedQueryStringParameters : [];
    var allParams = getAllParams(queryString);
    var allowedParams = [];
    allowedQueryStringParameters.forEach(function (param) {
      if (typeof param === 'string') {
        var pair = param.split('=');
        allowedParams.push({
          key: pair[0],
          value: typeof pair[1] === 'undefined' ? true : pair[1]
        });
      } else if (param && _typeof(param) === 'object' && hasOwn(param, 'key') && hasOwn(param, 'value') // Schema check
      ) {
          param.key = param.key.trim();
          param.value = "".concat(param.value).trim();
          allowedParams.push(param);
        }
    });
    var result = false;
    allowedParams.forEach(function (param) {
      var currentResult = !!allParams.find(function (queryParam) {
        return param.key === queryParam.key && (param.value === queryParam.value || param.value === true);
      });
      result = result || currentResult;
    });
    return result;
  }
  /**
   * Returns true if logging should allowed
   */


  function _isLoggingAllowed() {
    var test = this.config.test;
    var disable = this.config.disable;
    var location = this.location;

    if (typeof test === 'function') {
      return test.apply(this.config, arguments);
    }

    return typeof console !== 'undefined' && (matchesURL(location.hostname, this.config) && matchesPort(location.port, this.config) || matchesQueryParam(location.search, this.config)) && !disable;
  }

  function rewireFunc() {
    var args = toArr(arguments);
    var fn = args.splice(0, 1)[0];
    var prefixes = this.config.prefixes;

    while (prefixes.length) {
      args.unshift(prefixes.pop());
    }

    if (this.isLoggingAllowed(args) && console[fn]) {
      var c;
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


  var Logger = /*#__PURE__*/function () {
    function Logger(config) {
      _classCallCheck(this, Logger);

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

    _createClass(Logger, [{
      key: "isLoggingAllowed",
      value: function isLoggingAllowed(args) {
        return _isLoggingAllowed.apply(this, args);
      }
    }, {
      key: "log",
      value: function log() {
        return rewireFunc.apply(this, getArgs('log', arguments));
      }
    }, {
      key: "warn",
      value: function warn() {
        return rewireFunc.apply(this, getArgs('warn', arguments));
      }
    }, {
      key: "debug",
      value: function debug() {
        return rewireFunc.apply(this, getArgs('debug', arguments));
      }
    }, {
      key: "error",
      value: function error() {
        return rewireFunc.apply(this, getArgs('error', arguments));
      }
    }, {
      key: "info",
      value: function info() {
        return rewireFunc.apply(this, getArgs('info', arguments));
      }
    }, {
      key: "dir",
      value: function dir() {
        return rewireFunc.apply(this, getArgs('dir', arguments));
      }
    }, {
      key: "dirxml",
      value: function dirxml() {
        return rewireFunc.apply(this, getArgs('dirxml', arguments));
      }
    }, {
      key: "table",
      value: function table() {
        return rewireFunc.apply(this, getArgs('table', arguments));
      }
    }, {
      key: "trace",
      value: function trace() {
        return rewireFunc.apply(this, getArgs('trace', arguments));
      }
    }, {
      key: "group",
      value: function group() {
        return rewireFunc.apply(this, getArgs('group', arguments));
      }
    }, {
      key: "groupCollapsed",
      value: function groupCollapsed() {
        return rewireFunc.apply(this, getArgs('groupCollapsed', arguments));
      }
    }, {
      key: "groupEnd",
      value: function groupEnd() {
        return rewireFunc.apply(this, getArgs('groupEnd', arguments));
      }
    }, {
      key: "clear",
      value: function clear() {
        return rewireFunc.apply(this, getArgs('clear', arguments));
      }
    }, {
      key: "count",
      value: function count() {
        return rewireFunc.apply(this, getArgs('count', arguments));
      }
    }, {
      key: "countReset",
      value: function countReset() {
        return rewireFunc.apply(this, getArgs('countReset', arguments));
      }
    }, {
      key: "assert",
      value: function assert() {
        return rewireFunc.apply(this, getArgs('assert', arguments));
      }
    }, {
      key: "profile",
      value: function profile() {
        return rewireFunc.apply(this, getArgs('profile', arguments));
      }
    }, {
      key: "profileEnd",
      value: function profileEnd() {
        return rewireFunc.apply(this, getArgs('profileEnd', arguments));
      }
    }, {
      key: "time",
      value: function time() {
        return rewireFunc.apply(this, getArgs('time', arguments));
      }
    }, {
      key: "timeLog",
      value: function timeLog() {
        return rewireFunc.apply(this, getArgs('timeLog', arguments));
      }
    }, {
      key: "timeStamp",
      value: function timeStamp() {
        return rewireFunc.apply(this, getArgs('timeStamp', arguments));
      }
    }, {
      key: "context",
      value: function context() {
        return rewireFunc.apply(this, getArgs('context', arguments));
      }
    }]);

    return Logger;
  }();

  return Logger;

})));
//# sourceMappingURL=argonLogger.js.map
