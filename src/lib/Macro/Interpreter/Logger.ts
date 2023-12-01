export enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
}

export default class Logger {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    private log(message: string, level: LogLevel): void {
        if (level >= this.logLevel) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [${LogLevel[level]}]: ${message}`);
        }
    }

    public debug(message: string): void {
        this.log(message, LogLevel.DEBUG);
    }


    public info(message: string): void {
        this.log(message, LogLevel.INFO);
    }

    public warn(message: string): void {
        this.log(message, LogLevel.WARNING);
    }

    public error(message: string): void {
        this.log(message, LogLevel.ERROR);
    }
}