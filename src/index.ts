import { includes } from './polyfills/includes';
import { find } from './polyfills/find';
import { isArr, assign } from './utils';

type Config = {
  allowedHostnames?: string[];
  disable?: boolean;
  allowedQueryStringParameters?: string[];
  allowedPorts?: string[];
  prefixes?: string[];
};

type Param = {
  key: string;
  value: string | boolean;
};

/**
 * Tests if current host name matches allowed hostnames
 * @param {string} hostname Current hostname
 * @param {object} config Configuration
 */
function matchesURL(hostname: string, config: Config): boolean {
  const allowedHostnames = (
    isArr(config.allowedHostnames) ? config.allowedHostnames : []
  ) as string[];
  return (
    allowedHostnames.length === 0 ||
    Boolean(find<string>(allowedHostnames, (URL) => includes(URL, hostname)))
  );
}

/**
 * Checks if given port is allowed
 * @param {string} port Current port
 * @param {object} config Configuration
 */
function matchesPort(port: string, config: Config): boolean {
  let allowedPorts = (
    isArr(config.allowedPorts) ? config.allowedPorts : []
  ) as string[];
  allowedPorts = allowedPorts.map((port) => `${port}`.trim());
  return allowedPorts.length === 0 || includes(allowedPorts, port);
}

/**
 * Returns a map of query string key value pairs
 * @param {string} queryString Current query string
 */
function getAllParams(queryString: string): Param[] {
  queryString = queryString.substring(Number(queryString.charAt(0) === '?'));
  return queryString.split('&').map((pairs) => {
    const pair = pairs
      .split('=')
      .map((part) => decodeURIComponent(part).trim());
    return { key: pair[0], value: pair[1] };
  });
}

/**
 * Alias for hasOwnProperty
 * @param {object} object Target object
 * @param {string} key Key name
 */
function hasOwn(object: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Tests if any existing query parameter matches configuration
 * @param {string} queryString Query string
 * @param {object} config Configuration
 */
function matchesQueryParam(queryString: string, config: Config): boolean {
  const allowedQueryStringParameters = isArr(
    config.allowedQueryStringParameters
  )
    ? config.allowedQueryStringParameters
    : [];
  const allParams = getAllParams(queryString);
  const allowedParams = [] as Param[];
  allowedQueryStringParameters?.forEach((param: string | Param) => {
    if (typeof param === 'string') {
      const pair = param.split('=');
      allowedParams.push({
        key: pair[0],
        value: typeof pair[1] === 'undefined' ? true : pair[1],
      });
    } else if (
      param &&
      typeof param === 'object' &&
      hasOwn(param, 'key') &&
      hasOwn(param, 'value') // Schema check
    ) {
      param.key = param.key.trim();
      param.value = `${param.value}`.trim();
      allowedParams.push(param);
    }
  });
  let result = false;
  allowedParams.forEach((param) => {
    const currentResult = Boolean(
      find<Param>(
        allParams,
        (queryParam) =>
          param.key === queryParam.key &&
          (param.value === queryParam.value || param.value === true)
      )
    );
    result = result || currentResult;
  });
  return result;
}

/**
 * Returns true if logging should allowed
 */
function isLoggingAllowed(...args: any[]) {
  const test = this.config.test;
  const disable = this.config.disable;
  const location = this.location;
  if (typeof test === 'function') {
    return test.apply(this.config, args);
  }
  return (
    typeof console !== 'undefined' &&
    ((matchesURL(location.hostname, this.config) &&
      matchesPort(location.port, this.config)) ||
      matchesQueryParam(location.search, this.config)) &&
    !disable
  );
}

function rewireFunc(fn: string, ...args: any[]): void {
  const prefixes = this.config.prefixes;
  args = prefixes.concat(args);
  // eslint-disable-next-line
  // @ts-ignore
  if (this.isLoggingAllowed(args) && console[fn]) {
    let c;
    // eslint-disable-next-line
    // @ts-ignore
    (c = console)[fn].apply(c, args);
  }
}

export function autowire(
  _: unknown,
  propertyName: string,
  desc: PropertyDescriptor
): PropertyDescriptor | void {
  if (!(propertyName in console)) {
    throw new Error(`Invalid console method: "${propertyName}"`);
  }
  return {
    configurable: true,
    enumerable: false,
    get() {
      const self = this;
      return function (...args: any[]) {
        desc.value.apply(self, args);
        rewireFunc.apply(self, [propertyName, ...args]);
      }.bind(this);
    },
  } as PropertyDescriptor;
}

/**
 * Logger class
 * @class
 */
export class Logger {
  config: Config;
  location: Location;
  URL: string;
  constructor(config?: Config) {
    config = config || ({} as Config);
    this.config = Object.freeze(
      assign<Config>(
        {
          allowedHostnames: ['localhost', '127.0.0.1', '0.0.0.0'],
          disable: false,
          allowedQueryStringParameters: ['debug'],
          allowedPorts: [],
          prefixes: [],
        },
        config
      )
    );
    this.location =
      typeof window === 'undefined' ? ({} as Location) : window.location;
    this.URL = this.location.href;
  }
  get self(): Logger {
    return this;
  }
  isLoggingAllowed(args: any[]): boolean {
    return isLoggingAllowed.apply(this, args);
  }
  protected rewire(method: keyof Console, ...args: any[]): void {
    rewireFunc.apply(this.self, [method, ...args]);
  }

  @autowire
  log(): void {}
  @autowire
  warn(): void {}
  @autowire
  debug(): void {}
  @autowire
  error(): void {}
  @autowire
  info(): void {}
}
