# Argon logger

Argon Logger is a powerful tool built to enhance and surpass the traditional
`console.log(...)` functionality. It provides comprehensive control over the
output of your logs, allowing you to customize their behavior according to your
specific needs.

With Argon Logger, you can seamlessly replace `console.log(...)` with a more
flexible and versatile logging solution. You gain the ability to determine
exactly how your logs should be handled, giving you greater control over their
visibility and destination.

In production environments, security is paramount. Argon Logger offers the
option to suppress logs entirely, ensuring that sensitive information remains
hidden from prying eyes. You can rest assured that your logs won't inadvertently
expose critical data.

Additionally, Argon Logger allows you to redirect logs to alternative
destinations beyond the default `console`. This flexibility enables you to
capture logs in various contexts, such as storing them in a file, sending them
to a remote server, or integrating them with a dedicated logging service. The
choice is yours, and Argon Logger empowers you to tailor the log output to suit
your specific requirements.

By leveraging Argon Logger, you can elevate your logging capabilities, enhance
security, and achieve greater flexibility in handling log messages. Say goodbye
to the limitations of `console.log(...)` and unlock a new level of control and
customization with Argon Logger.

# Install

```sh
npm i argon-logger
```

## Usage

Argon Logger provides a familiar interface that closely resembles the widely
used `console` object. You can seamlessly integrate it into your codebase and
start leveraging its enhanced logging capabilities. Here's an example showcasing
how to use Argon Logger:

```js
import { logger } from "argon-logger";

logger.log("Hello"); // Output: Hello
logger.warn("This is a warning"); // Output: This is a warning
logger.error("This is an error"); // Output: This is an error
logger.debug("This is a debug message"); // Output: This is a debug message
logger.info("This is an info message"); // Output: This is an info message
```

As you can see, using Argon Logger is similar to utilizing regular `console`
methods. You can call `logger.log(...)`, `logger.warn(...)`,
`logger.error(...)`, `logger.debug(...)`, and `logger.info(...)` to log messages
of different severity levels.

However, what sets Argon Logger apart is its intelligent filtering and
customization capabilities. By default, it offers a concise set of API methods
to ensure a compact library size. It also limits log visibility to the
`localhost` environment, which enhances security by preventing logs from being
exposed in production environments.

Moreover, Argon Logger provides the flexibility to extend its API and modify
restriction levels. Consider the following example:

```js
import { autowire, Logger } from "argon-logger";

class MyLogger extends Logger {
  constructor(config) {
    super(config);
  }

  @autowire() // Automatically wires "console" method if the API supports it
  time() {}

  @autowire()
  timeEnd() {}

  customLogMethod(...args) {
    this.api.log(...args);
  }
}

const logger = new MyLogger({
  api: console, // The default api is "console"
  disable: location.hostname !== "localhost",
});

logger.time("Timer");
// ...
logger.timeEnd("Timer");
logger.customLogMethod("Custom method");
```

In this example, a custom logger class, MyLogger, extends the base Logger class
from Argon Logger. It introduces additional methods such as `time()`,
`timeEnd()`, and `customLogMethod()`. The `@autowire()` decorator automatically
wires the corresponding methods from the API if supported. By customizing the
logger, you can tailor it to your specific needs.

With Argon Logger, you gain not only the simplicity and familiarity of
`console`-like methods but also the ability to fine-tune and extend its
functionality to suit your requirements. Empower your logging experience with
Argon Logger and unlock its powerful customization options.

# Contributing

We welcome contributions from the community to enhance the plugin's
functionality and address any issues. If you have any feedback, bug reports, or
feature requests, please don't hesitate to
[open an issue](https://github.com/scssyworks/argon-logger/issues) or submit a
pull request on GitHub.
