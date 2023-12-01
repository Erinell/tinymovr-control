import { writable } from "svelte/store";

export const console_lines = writable<string[]>([]);

export enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
}


class Console {
    private logLevel: LogLevel;

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel;
    }

    private log(message: string, level: LogLevel): void {
        if (level >= this.logLevel) {
            const timestamp = new Date().toISOString();
            // console_lines.update(l => [...l, `[${timestamp}] [${LogLevel[level]}]: ${message}`]);
            console_lines.update(l => [...l, `[${LogLevel[level]}]: ${message}`]);
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

export const console = new Console(LogLevel.INFO);

export const console_visible = writable<boolean>(false);