import type Logger from "./Logger";
import type { Statement, VirtualMachine } from "./Types";


export default class Interpreter {
    protected vm: VirtualMachine;
    protected statements: Array<any>;
    protected logger: Logger;

    constructor(vm: VirtualMachine, statements: Array<any>, logger:any) {
        this.vm = vm;
        this.statements = statements;
        this.logger = logger;
    }

    public async run() {
        this.logger.debug("Running interpreter...");
        await this.interpretStatements(this.statements);
    }

    /**
     * reset variables from the last run.
     */
    public reset() {
        this.vm.variables = {};
    }

    public async interpretStatements(statements: Array<Statement>) {
        let result: any = null;
        for (const [i, statement] of statements.entries()) {
            result = await this.interpretStatement(statement);
        }
        return result;
    }

    private async interpretStatement(statement: Statement) {
        switch (statement.type) {
            case 'assignment':
                return this.interpretAssignment(statement);
            case 'function':
                return this.interpretFunctionCall(statement);
            case 'if':
                return this.interpretIf(statement);
            case 'ifelse':
                return this.interpretIfElse(statement);
            case 'while':
                return this.interpretWhile(statement);
        }
        this.logger.error(`Invalid statement type: ${statement.type}`);
    };

    private interpretAssignment(statement: Statement) {
        this.logger.debug("Interpreting an assignment...");
        this.vm.variables[statement.name] = this.interpretExpression(statement.expression);
        return this.vm.variables[statement.name];
    };

    private interpretExpression(expression: any) {
        switch (expression.type) {
            case 'string':
                return expression.value;
            case 'number':
                return parseFloat(expression.value);
            case 'variable':
                return this.interpretVariableRetrieval(expression);
            case 'function':
                return this.interpretFunctionCall(expression);
            case 'unary':
                return this.interpretUnaryOperation(expression);
            case 'operation':
                return this.interpretBinaryOperation(expression);
        }
        this.logger.error(`Invalid type: ${expression.type}`);
    };

    private interpretVariableRetrieval(expression: any) {
        this.logger.debug(`Interpreting the variable retrieval of ${expression.name}`);
        
        if (!(expression.name in this.vm.variables)) {
            this.logger.error(`Runtime Error. Variable '${expression.name}' does not exist.`);
        }
        return this.vm.variables[expression.name];
    };

    private async interpretFunctionCall(expression: any) {
        this.logger.debug(`Interpreting the function ${expression.name}`);
        if (!(expression.name in this.vm.functions)) {
            this.logger.error(`Runtime Error. Function '${expression.name}' is not defined.`);
        }

        const parameters: any = expression.parameters.map(
            (parameter: any) => this.interpretExpression(parameter)
        );

        return await this.vm.functions[expression.name](...parameters);
    };

    private interpretUnaryOperation(expression: any) {
        this.logger.debug("Interpreting an unary operation...");
        
        const value: any = this.interpretExpression(expression.value);
        return expression.withNot ? !value : value;
    };

    private interpretBinaryOperation(expression: any) {
        this.logger.debug("Interpreting a binary operation...");

        const leftValue: any = this.interpretExpression(expression.left);
        const rightValue: any = this.interpretExpression(expression.right);
        switch (expression.operation) {
            case '+':
                return leftValue + rightValue;
            case '-':
                return leftValue - rightValue;
            case '*':
                return leftValue * rightValue;
            case '/':
                return leftValue / rightValue;
            case '&&':
                return leftValue && rightValue;
            case '||':
                return leftValue || rightValue;
            case '>':
                return leftValue > rightValue;
            case '<':
                return leftValue < rightValue;
            case '<=':
                return leftValue <= rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '==':
                return leftValue == rightValue;
            case '!=':
                return leftValue != rightValue;
        }

        this.logger.error(`Invalid operation requested: ${expression.operation}`);
    };

    private interpretIf(statement: any) {
        this.logger.debug("Interpreting a if condition...");
        
        const checkValue = this.interpretExpression(statement.check);

        if (checkValue) {
            return this.interpretStatements(statement.statements);
        }
        return null;
    };

    private async interpretWhile(statement: any) {
        this.logger.debug("Interpreting a while loop...");

        let security = 0;
        
        while (this.interpretExpression(statement.check)) {
            await this.interpretStatements(statement.statements);
            security++;
            if (security >= 1000) {
                this.logger.error(`You have reached the limit of 1000 operations in while loop.`);
                break;
            }
        }
        return null;
    }

    private interpretIfElse(statement: any) {
        this.logger.debug("Interpreting a ifelse condition...");

        const checkValue = this.interpretExpression(statement.check);
        if (checkValue) {
            return this.interpretStatements(statement.ifStatements);
        } else {
            return this.interpretStatements(statement.elseStatements);
        }
    }
}