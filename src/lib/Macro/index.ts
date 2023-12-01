// https://github.com/ArekX/javascript-interpreter-example/blob/main/index.js
import analyseCode from "./Interpreter/Lexer";
import parseTokens from "./Interpreter/Parser";
import Interpreter from "./Interpreter/Interpreter";
import { device } from "$lib/store";
import { get } from "svelte/store";
// import Logger, { LogLevel } from "./Interpreter/Logger";
import { console, LogLevel } from "$lib/Components/Console";
// const logger = new Logger(LogLevel.WARNING);

const vm = {
    variables: {},
    functions: {
        print(message: string) {
            console.info(message);
        },
        send(api: string, value: string | number | null) {
            get(device)?.send(api, value, (value: string) => {
                this.print(api + " = " + value);
            });
        },
        async sleep(ms: number) {
            const wait = (time: number) => { return new Promise((resolve) => setTimeout(resolve, time)); }
            await wait(ms);
        }
    }
};



export async function run(code: string) {
    try {
        const tokens = analyseCode(code);
        const statements = parseTokens(tokens);
        let interpreter = new Interpreter(vm, statements, console);

        await interpreter.run();
        interpreter.reset();
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

// console.log('Code we ran:');
// console.log(code);
// console.log('Result:')
// console.dir(result, {depth: null});
// console.log('Final VM State:', vm);