function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
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

var _dec, _dec2, _dec3, _dec4, _dec5, _initProto;
function createAddInitializerMethod(initializers, decoratorFinishedRef) { return function (initializer) { assertNotFinished(decoratorFinishedRef, "addInitializer"), assertCallable(initializer, "An initializer"), initializers.push(initializer); }; }
function assertInstanceIfPrivate(has, target) { if (!has(target)) throw new TypeError("Attempted to access private element on non-instance"); }
function memberDec(dec, thisArg, name, desc, initializers, kind, isStatic, isPrivate, value, hasPrivateBrand) { var kindStr; switch (kind) { case 1: kindStr = "accessor"; break; case 2: kindStr = "method"; break; case 3: kindStr = "getter"; break; case 4: kindStr = "setter"; break; default: kindStr = "field"; } var get, set, ctx = { kind: kindStr, name: isPrivate ? "#" + name : name, static: isStatic, private: isPrivate }, decoratorFinishedRef = { v: !1 }; if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef)), isPrivate || 0 !== kind && 2 !== kind) { if (2 === kind) get = function (target) { return assertInstanceIfPrivate(hasPrivateBrand, target), desc.value; };else { var t = 0 === kind || 1 === kind; (t || 3 === kind) && (get = isPrivate ? function (target) { return assertInstanceIfPrivate(hasPrivateBrand, target), desc.get.call(target); } : function (target) { return desc.get.call(target); }), (t || 4 === kind) && (set = isPrivate ? function (target, value) { assertInstanceIfPrivate(hasPrivateBrand, target), desc.set.call(target, value); } : function (target, value) { desc.set.call(target, value); }); } } else get = function (target) { return target[name]; }, 0 === kind && (set = function (target, v) { target[name] = v; }); var has = isPrivate ? hasPrivateBrand.bind() : function (target) { return name in target; }; ctx.access = get && set ? { get: get, set: set, has: has } : get ? { get: get, has: has } : { set: set, has: has }; try { return dec.call(thisArg, value, ctx); } finally { decoratorFinishedRef.v = !0; } }
function assertNotFinished(decoratorFinishedRef, fnName) { if (decoratorFinishedRef.v) throw new Error("attempted to call " + fnName + " after decoration was finished"); }
function assertCallable(fn, hint) { if ("function" != typeof fn) throw new TypeError(hint + " must be a function"); }
function assertValidReturnValue(kind, value) { var type = typeof value; if (1 === kind) { if ("object" !== type || null === value) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); void 0 !== value.get && assertCallable(value.get, "accessor.get"), void 0 !== value.set && assertCallable(value.set, "accessor.set"), void 0 !== value.init && assertCallable(value.init, "accessor.init"); } else if ("function" !== type) { var hint; throw hint = 0 === kind ? "field" : 5 === kind ? "class" : "method", new TypeError(hint + " decorators must return a function or void 0"); } }
function curryThis1(fn) { return function () { return fn(this); }; }
function curryThis2(fn) { return function (value) { fn(this, value); }; }
function applyMemberDec(ret, base, decInfo, decoratorsHaveThis, name, kind, isStatic, isPrivate, initializers, hasPrivateBrand) { var desc, init, value, newValue, get, set, decs = decInfo[0]; decoratorsHaveThis || Array.isArray(decs) || (decs = [decs]), isPrivate ? desc = 0 === kind || 1 === kind ? { get: curryThis1(decInfo[3]), set: curryThis2(decInfo[4]) } : 3 === kind ? { get: decInfo[3] } : 4 === kind ? { set: decInfo[3] } : { value: decInfo[3] } : 0 !== kind && (desc = Object.getOwnPropertyDescriptor(base, name)), 1 === kind ? value = { get: desc.get, set: desc.set } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set); for (var inc = decoratorsHaveThis ? 2 : 1, i = decs.length - 1; i >= 0; i -= inc) { var newInit; if (void 0 !== (newValue = memberDec(decs[i], decoratorsHaveThis ? decs[i - 1] : void 0, name, desc, initializers, kind, isStatic, isPrivate, value, hasPrivateBrand))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = newValue.init, get = newValue.get || value.get, set = newValue.set || value.set, value = { get: get, set: set }) : value = newValue, void 0 !== newInit && (void 0 === init ? init = newInit : "function" == typeof init ? init = [init, newInit] : init.push(newInit)); } if (0 === kind || 1 === kind) { if (void 0 === init) init = function (instance, init) { return init; };else if ("function" != typeof init) { var ownInitializers = init; init = function (instance, init) { for (var value = init, i = ownInitializers.length - 1; i >= 0; i--) value = ownInitializers[i].call(instance, value); return value; }; } else { var originalInitializer = init; init = function (instance, init) { return originalInitializer.call(instance, init); }; } ret.push(init); } 0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) { return value.get.call(instance, args); }), ret.push(function (instance, args) { return value.set.call(instance, args); })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) { return value.call(instance, args); }) : Object.defineProperty(base, name, desc)); }
function applyMemberDecs(Class, decInfos, instanceBrand) { for (var protoInitializers, staticInitializers, staticBrand, ret = [], existingProtoNonFields = new Map(), existingStaticNonFields = new Map(), i = 0; i < decInfos.length; i++) { var decInfo = decInfos[i]; if (Array.isArray(decInfo)) { var base, initializers, kind = decInfo[1], name = decInfo[2], isPrivate = decInfo.length > 3, decoratorsHaveThis = 16 & kind, isStatic = !!(8 & kind), hasPrivateBrand = instanceBrand; if (kind &= 7, isStatic ? (base = Class, 0 !== kind && (initializers = staticInitializers = staticInitializers || []), isPrivate && !staticBrand && (staticBrand = function (_) { return _checkInRHS(_) === Class; }), hasPrivateBrand = staticBrand) : (base = Class.prototype, 0 !== kind && (initializers = protoInitializers = protoInitializers || [])), 0 !== kind && !isPrivate) { var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields, existingKind = existingNonFields.get(name) || 0; if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name); existingNonFields.set(name, !(!existingKind && kind > 2) || kind); } applyMemberDec(ret, base, decInfo, decoratorsHaveThis, name, kind, isStatic, isPrivate, initializers, hasPrivateBrand); } } return pushInitializers(ret, protoInitializers), pushInitializers(ret, staticInitializers), ret; }
function pushInitializers(ret, initializers) { initializers && ret.push(function (instance) { for (var i = 0; i < initializers.length; i++) initializers[i].call(instance); return instance; }); }
function applyClassDecs(targetClass, classDecs, decoratorsHaveThis) { if (classDecs.length) { for (var initializers = [], newClass = targetClass, name = targetClass.name, inc = decoratorsHaveThis ? 2 : 1, i = classDecs.length - 1; i >= 0; i -= inc) { var decoratorFinishedRef = { v: !1 }; try { var nextNewClass = classDecs[i].call(decoratorsHaveThis ? classDecs[i - 1] : void 0, newClass, { kind: "class", name: name, addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef) }); } finally { decoratorFinishedRef.v = !0; } void 0 !== nextNewClass && (assertValidReturnValue(5, nextNewClass), newClass = nextNewClass); } return [newClass, function () { for (var i = 0; i < initializers.length; i++) initializers[i].call(newClass); }]; } }
function _applyDecs(targetClass, memberDecs, classDecs, classDecsHaveThis, instanceBrand) { return { e: applyMemberDecs(targetClass, memberDecs, instanceBrand), get c() { return applyClassDecs(targetClass, classDecs, classDecsHaveThis); } }; }
function _checkInRHS(value) { if (Object(value) !== value) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== value ? typeof value : "null")); return value; }
var Env = /*#__PURE__*/function (Env) {
  Env["NODE"] = "node";
  Env["BROWSER"] = "browser";
  Env["UNKNOWN"] = "unknown";
  return Env;
}(Env || {});
function checkEnv() {
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    return Env.NODE;
  }
  if (typeof window !== "undefined") {
    return Env.BROWSER;
  }
  return Env.UNKNOWN;
}
function shouldDisable() {
  var _process$env;
  switch (checkEnv()) {
    case Env.NODE:
      return typeof process !== "undefined" && ((_process$env = process.env) === null || _process$env === void 0 ? void 0 : _process$env.NODE_ENV) === "production";
    case Env.BROWSER:
      return !["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
    case Env.UNKNOWN:
    default:
      return true;
  }
}
function rewire(fn, formatter) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  const {
    api,
    prefixes
  } = this.config;
  args = prefixes.concat(args);
  if (this.allowed(...args)) {
    if (typeof formatter === "function") {
      const out = formatter(...args);
      api[fn](out);
    } else {
      api[fn](...args);
    }
  }
}
function autowire(customFormatter) {
  return function (originalFunc, _ref) {
    let {
      kind,
      name
    } = _ref;
    if (kind === "method") {
      if (!(name in console)) {
        throw new Error(`Invalid console method: "${name}"`);
      }
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        originalFunc.apply(this, args);
        rewire.apply(this, [name, customFormatter, ...args]);
      };
    }
  };
}

/**
 * Logger class
 * @class
 */
_dec = autowire();
_dec2 = autowire();
_dec3 = autowire();
_dec4 = autowire();
_dec5 = autowire();
class Logger {
  constructor(config) {
    _defineProperty(this, "config", void 0);
    _defineProperty(this, "api", void 0);
    _initProto(this);
    config = config || {};
    this.config = Object.freeze(Object.assign({
      api: console,
      disable: false,
      prefixes: []
    }, config));
    this.api = this.config.api;
  }
  allowed() {
    const conf = this.config;
    if (typeof conf.test === "function") {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return conf.test.apply(this, args);
    }
    return !conf.disable;
  }
  log() {}
  warn() {}
  debug() {}
  error() {}
  info() {}
}
[_initProto] = _applyDecs(Logger, [[_dec, 2, "log"], [_dec2, 2, "warn"], [_dec3, 2, "debug"], [_dec4, 2, "error"], [_dec5, 2, "info"]], []).e;
const logger = new Logger({
  disable: shouldDisable()
});

export { Logger, autowire, logger };
//# sourceMappingURL=logger.development.mjs.map