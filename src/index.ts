interface Config<T> {
  disable?: boolean;
  prefixes?: string[];
  test?: (...args: any[]) => boolean;
  api?: T;
}

type LoggerFunction = (...args: any[]) => void;
type FormatterFunction = (...args: any[]) => any;

enum Env {
  NODE = "node",
  BROWSER = "browser",
  UNKNOWN = "unknown",
}

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
  switch (checkEnv()) {
    case Env.NODE:
      return typeof process !== "undefined" &&
        process.env?.NODE_ENV === "production";
    case Env.BROWSER:
      return !["localhost", "127.0.0.1", "0.0.0.0"].includes(
        window.location.hostname,
      );
    case Env.UNKNOWN:
    default:
      return true;
  }
}

function rewire(
  fn: string,
  formatter?: FormatterFunction,
  ...args: any[]
): void {
  const { api, prefixes } = this.config;
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

export function autowire(customFormatter?: FormatterFunction) {
  return function (
    originalFunc: LoggerFunction,
    { kind, name }: { kind: string; name: string },
  ): LoggerFunction | void {
    if (kind === "method") {
      if (!(name in console)) {
        throw new Error(`Invalid console method: "${name}"`);
      }
      return function (...args: any[]) {
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
export class Logger<T = Console> {
  config: Config<T>;
  api: T;
  constructor(config?: Config<T>) {
    config = config || ({} as Config<T>);
    this.config = Object.freeze(
      Object.assign(
        {
          api: console,
          disable: false,
          prefixes: [],
        },
        config,
      ),
    );
    this.api = this.config.api as T;
  }
  allowed(...args: any[]): boolean {
    const conf = this.config;
    if (typeof conf.test === "function") {
      return conf.test.apply(this, args);
    }
    return !conf.disable;
  }

  @autowire()
  log(): void {}
  @autowire()
  warn(): void {}
  @autowire()
  debug(): void {}
  @autowire()
  error(): void {}
  @autowire()
  info(): void {}
}

export const logger = new Logger<Console>({
  disable: shouldDisable(),
});
