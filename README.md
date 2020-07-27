# Argon logger [![Build Status](https://travis-ci.org/scssyworks/argon-logger.svg?branch=master)](https://travis-ci.org/scssyworks/argon-logger)

A ``console`` logger that you can control.

# Installation

```sh
npm i argon-logger
```

# How it works?

Argon logger exposes the same console API but with control over when and where you want to generate logs. Argon logger uses URL schema to determine whether it should log results or not. By default it enable logs only for ``localhost`` URLs which makes it perfect for production use (caution on the last part though).

## Without configuration

```js
import Logger from 'argon-logger';

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

# Word of caution

This is a minor release and there are no major versions out there yet. It means that it is changing frequently. Use it at your own risk.