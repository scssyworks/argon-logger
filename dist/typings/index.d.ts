interface Config<T> {
    disable?: boolean;
    prefixes?: string[];
    test?: (...args: any[]) => boolean;
    api?: T;
}
type LoggerFunction = (...args: any[]) => void;
type FormatterFunction = (...args: any[]) => any;
export declare function autowire(customFormatter?: FormatterFunction): (originalFunc: LoggerFunction, { kind, name }: {
    kind: string;
    name: string;
}) => LoggerFunction | void;
export declare class Logger<T = Console> {
    config: Config<T>;
    api: T;
    constructor(config?: Config<T>);
    allowed(...args: any[]): boolean;
    log(): void;
    warn(): void;
    debug(): void;
    error(): void;
    info(): void;
}
export declare const logger: Logger<Console>;
export {};
//# sourceMappingURL=index.d.ts.map