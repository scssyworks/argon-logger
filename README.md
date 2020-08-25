# Argon logger [![Build Status](https://travis-ci.org/scssyworks/argon-logger.svg?branch=master)](https://travis-ci.org/scssyworks/argon-logger)

A ``console`` logger that you can control.

# Installation

```sh
npm i argon-logger
```

# How it works?

Argon logger allows you to configure ``console`` methods especially if you want to turn off logs for certain web addresses. It's super easy to use.

## Without configuration

The built-in ``Logger`` class implements five commonly used methods: ``log``, ``debug``, ``warn``, ``error`` and ``info``.

```js
import { Logger } from 'argon-logger';

const logger = new Logger();

logger.log('Hello'); // -> Hello
logger.warn('This is a warning'); // -> This is a warning
logger.error('This is an error'); // -> This is an error
logger.debug('This is a debug message'); // -> This is a debug message
...
```

## With configuration

```js
const logger = new Logger({
    allowedHostnames: ['google.com'], // List of hostnames allowed. Set this to an empty array to allow logs everywhere.
    allowedQueryStringParameters: ['debug=true'], // List of query string parameters for which logs should be generated.
    allowedPorts: [], // List of ports for which logging should be enabled
    test: (...logArguments) => { ... }, // A test function for full flexibility on customizing where to hide the logs
                         // A test function overrides existing filters.
    prefixes: [], // Array of strings to be prepended automatically before each log.
    disable: false // If set to "true" disables the logging completely. The remaining two parameters are ignored.
});

logger.log('Hello'); // Hello
logger.warn('This is a warning'); // This is a warning
...
```

# Extending logger API

Argon Logger doesn't implement every ``console`` method out of the box. However, it doesn't stop you from adding new methods to ArgonLogger. To wire-up new methods you need to follow the steps below:

## Step 1

Create a class that extends ``Logger``.

```js
class MyLogger extends Logger {
    constructor(config) {
        super(config);
    }
}

const myLoggerInstance = new MyLogger();
```

## Step 2

Add a valid console method.

```js
class MyLogger extends Logger {
    constructor(config) {
        super(config);
    }
    count() { ... }
}
...
```

In order to take advantage of Logger configuration, you need to rewire these methods. There are two ways of doing that:

## Step 3: Re-wire methods using ``rewire``

```js
class MyLogger extends Logger {
    constructor(config) {
        super(config);
    }
    count() {
        this.rewire('count', ...arguments);
    }
}
```

## Step 3: Re-wire using ``autowire`` decorator

Decorators are stage 2 proposal for JavaScript. In order to use ``autowire`` decorator you might need an appropriate babel plugin.

```js
import { Logger, autowire } from 'argon-logger';
class MyLogger extends Logger {
    constructor(config) {
        super(config);
    }
    @autowire
    count() {}
}
```

# Word of caution

This is a minor release and therefore no major versions are out there yet. Use this release with caution. Feel free to report bugs and submit PRs.