/**!
 * A simple console logging utility
 * Released under MIT license
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version v0.3.0
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ArgonLogger = {}));
}(this, (function (exports) { 'use strict';

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object.keys(descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object.defineProperty(target, property, desc);
      desc = null;
    }

    return desc;
  }

  function includes(arr, el) {
    return arr.indexOf(el) > -1;
  }

  function find(arr, cb) {
    return arr.filter(function (item, index) {
      return cb(item, index);
    })[0];
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
    var target = isObject(arguments.length <= 0 ? undefined : arguments[0]) ? arguments.length <= 0 ? undefined : arguments[0] : {};

    for (var i = 1; i < arguments.length; i++) {
      loopFunc(i < 0 || arguments.length <= i ? undefined : arguments[i], target);
    }

    return target;
  }

  var _class, _temp;

  /**
   * Tests if current host name matches allowed hostnames
   * @param {string} hostname Current hostname
   * @param {object} config Configuration
   */
  function matchesURL(hostname, config) {
    var allowedHostnames = isArr(config.allowedHostnames) ? config.allowedHostnames : [];
    return allowedHostnames.length === 0 || Boolean(find(allowedHostnames, function (URL) {
      return includes(URL, hostname);
    }));
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
    return allowedPorts.length === 0 || includes(allowedPorts, port);
  }
  /**
   * Returns a map of query string key value pairs
   * @param {string} queryString Current query string
   */


  function getAllParams(queryString) {
    queryString = queryString.substring(Number(queryString.charAt(0) === '?'));
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
    allowedQueryStringParameters === null || allowedQueryStringParameters === void 0 ? void 0 : allowedQueryStringParameters.forEach(function (param) {
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
      var currentResult = Boolean(find(allParams, function (queryParam) {
        return param.key === queryParam.key && (param.value === queryParam.value || param.value === true);
      }));
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return test.apply(this.config, args);
    }

    return typeof console !== 'undefined' && (matchesURL(location.hostname, this.config) && matchesPort(location.port, this.config) || matchesQueryParam(location.search, this.config)) && !disable;
  }

  function rewireFunc() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var fn = args.splice(0, 1)[0];
    var prefixes = this.config.prefixes;
    args = prefixes.concat(args);

    if (this.isLoggingAllowed(args) && console[fn]) {
      var c;
      (c = console)[fn].apply(c, args);
    }
  }

  function autowire(_, propertyName, desc) {
    if (!(propertyName in console)) {
      throw new Error("Invalid console method: \"".concat(propertyName, "\""));
    }

    return {
      configurable: true,
      enumerable: false,
      get: function get() {
        var self = this;
        return function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          desc.value.apply(self, args);
          rewireFunc.apply(self, [propertyName].concat(args));
        }.bind(this);
      }
    };
  }
  /**
   * Logger class
   * @class
   */

  var Logger = (_class = (_temp = /*#__PURE__*/function () {
    function Logger(config) {
      _classCallCheck(this, Logger);

      _defineProperty(this, "config", void 0);

      _defineProperty(this, "location", void 0);

      _defineProperty(this, "URL", void 0);

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
      key: "rewire",
      value: function rewire(method) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        rewireFunc.apply(this.self, [method].concat(args));
      }
    }, {
      key: "log",
      value: function log() {}
    }, {
      key: "warn",
      value: function warn() {}
    }, {
      key: "debug",
      value: function debug() {}
    }, {
      key: "error",
      value: function error() {}
    }, {
      key: "info",
      value: function info() {}
    }, {
      key: "self",
      get: function get() {
        return this;
      }
    }]);

    return Logger;
  }(), _temp), (_applyDecoratedDescriptor(_class.prototype, "log", [autowire], Object.getOwnPropertyDescriptor(_class.prototype, "log"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "warn", [autowire], Object.getOwnPropertyDescriptor(_class.prototype, "warn"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "debug", [autowire], Object.getOwnPropertyDescriptor(_class.prototype, "debug"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "error", [autowire], Object.getOwnPropertyDescriptor(_class.prototype, "error"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "info", [autowire], Object.getOwnPropertyDescriptor(_class.prototype, "info"), _class.prototype)), _class);

  exports.Logger = Logger;
  exports.autowire = autowire;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=argonLogger.js.map
