/**!
 * A simple console logging utility
 * Released under MIT license
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version v0.0.6
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Logger = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /**
   * Logger class
   * @class
   */
  var Logger = function Logger() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Logger);

    this.config = Object.freeze(_objectSpread2({
      allowedHostnames: ['localhost', '127.0.0.1', '0.0.0.0'],
      disable: false,
      allowedQueryStringParameters: ['debug']
    }, config));
    this.location = typeof window === 'undefined' ? {} : window.location;
    this.URL = this.location.href;
  };

  function matchesURL(hostname, config) {
    var allowedHostnames = Array.isArray(config.allowedHostnames) ? config.allowedHostnames : [];

    if (allowedHostnames.length === 0) {
      return true;
    }

    return !!allowedHostnames.filter(function (URL) {
      return URL.indexOf(hostname) > -1;
    }).length;
  }
  /**
   * Returns a map of query string key value pairs
   * @param {string} queryString Current query string
   */


  function getAllParams(queryString) {
    queryString = queryString.substring(queryString.charAt(0) === '?' ? 1 : 0);
    return queryString.split('&').map(function (pairs) {
      var _pairs$split$map = pairs.split('=').map(function (part) {
        return decodeURIComponent(part).trim();
      }),
          _pairs$split$map2 = _slicedToArray(_pairs$split$map, 2),
          key = _pairs$split$map2[0],
          value = _pairs$split$map2[1];

      return {
        key: key,
        value: value
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
    var allowedQueryStringParameters = Array.isArray(config.allowedQueryStringParameters) ? config.allowedQueryStringParameters : [];
    var allParams = getAllParams(queryString);
    var allowedParams = [];
    allowedQueryStringParameters.forEach(function (param) {
      if (typeof param === 'string') {
        var _param$split = param.split('='),
            _param$split2 = _slicedToArray(_param$split, 2),
            key = _param$split2[0],
            _param$split2$ = _param$split2[1],
            value = _param$split2$ === void 0 ? true : _param$split2$;

        allowedParams.push({
          key: key,
          value: value
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
      var currentResult = !!allParams.filter(function (queryParam) {
        return param.key === queryParam.key && (param.value === queryParam.value || param.value === true);
      }).length;
      result = result || currentResult;
    });
    return result;
  } // Extending current Logger class to include all console methods


  if (typeof console !== 'undefined') {
    Object.keys(console).forEach(function (prop) {
      if (typeof console[prop] === 'function') {
        Logger.prototype[prop] = function () {
          if ((matchesURL(this.location.hostname, this.config) || matchesQueryParam(this.location.search, this.config)) && !this.config.disable) {
            var _console;

            (_console = console)[prop].apply(_console, arguments);
          }
        };
      } else {
        Logger.prototype[prop] = console[prop];
      }
    });
  }

  return Logger;

}));
//# sourceMappingURL=argonLogger.js.map
