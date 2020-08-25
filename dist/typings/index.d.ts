declare type Config = {
    allowedHostnames?: string[];
    disable?: boolean;
    allowedQueryStringParameters?: string[];
    allowedPorts?: string[];
    prefixes?: string[];
};
export declare function autowire(_: unknown, propertyName: string, desc: PropertyDescriptor): PropertyDescriptor | void;
export declare class Logger {
    config: Config;
    location: Location;
    URL: string;
    constructor(config?: Config);
    get self(): Logger;
    isLoggingAllowed(args: any[]): boolean;
    protected rewire(method: keyof Console, ...args: any[]): void;
    log(): void;
    warn(): void;
    debug(): void;
    error(): void;
    info(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map