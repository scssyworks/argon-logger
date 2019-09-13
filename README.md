# Argon logger
Argon logger is a simple console logging utility with options to enable and disable logs for different environments.

# Installation

```sh
npm i argon-logger
```

# How it works?

Argon logger provide methods to generate console logs by extending the existing console API. Argon logger is simple to use

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

By default argon logger enables log statements for localhost URLs or URLs containing ``debug`` as a search parameter. We can change this behavior by providing a configuration.

## With configuration

```js
const logger = new Logger({
    allowedHostnames: ['google.com'], // List of hostnames allowed. Set this to an empty array to allow logs everywhere.
    allowedQueryStringParameters: ['debug=true'], // List of query string parameters for which logs should be generated.
    disable: false // If set to "true" disables the logging completely. The remaining two parameters are ignored.
});

logger.log('Hello'); // Hello
logger.warn('This is a warning'); // This is a warning
...
```
