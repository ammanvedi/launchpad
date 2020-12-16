export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

type Logger = (message: string) => void;

type LoggerSet = {
    info: Logger;
    warn: Logger;
    err: Logger;
};

export const createLogger = (prefix: string, level: LogLevel = LogLevel.INFO): Logger => {
    return (message) => {
        console.log(`${prefix} :: ${level} :: ${message}`);
    };
};

export const createLoggerSet = (prefix: string): LoggerSet => {
    return {
        info: createLogger(prefix, LogLevel.INFO),
        warn: createLogger(prefix, LogLevel.WARN),
        err: createLogger(prefix, LogLevel.ERROR),
    };
};
