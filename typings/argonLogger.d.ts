declare class Logger extends Console {
    constructor(config?: Logger.LoggerConstructorOptions);
    URL: string;
    location: object;
}

declare namespace Logger {
    export interface LoggerConstructorOptions {
        allowedHostnames?: string[]
        allowedQueryStringParameters?: string[]
        disable?: boolean
    }
}

export = Logger;