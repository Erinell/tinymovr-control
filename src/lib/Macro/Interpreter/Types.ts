export interface Token {
    character: number,
    start: number,
    end: number,
    line: number,
    type: string,
    value?: string
}

export interface GValue {
    type: string,
    value: string
}

export interface Expression {
    type: string,
    name: string,
    value: string,
    parameters: Array<Statement>
}

export interface GExpression {
    type: string,
    value: Array<GValue>
}

export interface GBinary {
    type: string,
    withNot: boolean,
    value: Array<GValue>
}

export interface GCheck {
    left: GBinary | GCheck,
    operation: string,
    right: GBinary | GCheck,
    type: string
}

export interface Statement {
    name: string,
    type: string,
    check: GCheck,
    statements: Array<GBinary> | Array<GCheck>,
    parameters: Array<GBinary> | Array<GCheck>
    expression: Array<GBinary> | Array<GCheck>
}

export interface VirtualMachine {
    variables: any,
    functions: any
}