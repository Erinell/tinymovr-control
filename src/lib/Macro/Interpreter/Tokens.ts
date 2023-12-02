import type CharacterReader from "./CharacterReader";

export function readComment(reader: CharacterReader) {
    if(reader.peek(2) == "//") {
        while(reader.peek() != '\n' && reader.hasNext()) {
            reader.next();
        }
    }
    return null;
}
export function readNumberToken(reader: CharacterReader) {
    let numberText = '';
    const numberMatch = /\d/;
    while (reader.hasNext()) {
        if (reader.peek().match(numberMatch)) {
            numberText += reader.peek();
            reader.next();
        } else {
            break;
        }
    }
    if (numberText.length == 0) {
        return null;
    }
    return { type: 'number', value: numberText };
}

export function readString(reader: CharacterReader) {
    let value = '';
    let startedReading = false;
    let isEscaping = false;
    while (reader.hasNext()) {
        const matchFound = reader.peek() == "'";
        if (!startedReading && !matchFound) {
            break;
        }
        if (reader.peek() == '\\' && !isEscaping) {
            isEscaping = true;
            reader.next();
            continue;
        }
        if (startedReading && matchFound && !isEscaping) {
            reader.next();
            break;
        }
        if (!startedReading && matchFound) {
            startedReading = true;
            reader.next();
            continue;
        }
        value += reader.peek();
        reader.next();
        isEscaping = false;
    }

    if (value.length == 0) {
        return null;
    }

    return { type: 'string', value };
}

export function readOperator(reader: CharacterReader) {
    const operatorMatch = /^(!|\+|-|\*|\/|==|!=|&&|\|\||<|>|<=|>=|=|!=)$/;
    const oneCharacterOperator = reader.peek();
    const twoCharacterOperator = reader.peek(2);

    let value = null;

    if (twoCharacterOperator.match(operatorMatch)) {
        reader.next(2);
        value = twoCharacterOperator;
    } else if (oneCharacterOperator.match(operatorMatch)) {
        reader.next();
        value = oneCharacterOperator;
    }

    if (value) {
        return { type: 'operator', value };
    }

    return null;
}

export function readName(reader: CharacterReader) {
    let value = '';
    const startOfVariableMatch = /[a-z]/;
    const restOfVariableMatch = /[a-zA-Z0-9]/;

    if (!reader.peek().match(startOfVariableMatch)) {
        return null;
    }

    value = reader.peek();
    reader.next();

    while (reader.hasNext() && reader.peek().match(restOfVariableMatch)) {
        value += reader.peek();
        reader.next();
    }

    return { type: 'name', value };
}

export function readKeyword(reader: CharacterReader) {
    if (reader.peek(2).match(/^if$/i)) {
        reader.next(2);
        return { type: 'keyword', value: 'if' };
    }
    if (reader.peek(4).match(/^else$/i)) {
        reader.next(4);
        return { type: 'keyword', value: 'else' };
    }

    if (reader.peek(5).match(/^while$/i)) {
        reader.next(5);
        return { type: 'keyword', value: 'while' };
    }

    if (reader.peek(1).match(/^#$/i)) {
        reader.next(1);
        return { type: 'keyword', value: '#' };
    }

    return null;
}

export function readParentheses(reader: CharacterReader) {
    if (reader.peek() == '(') {
        reader.next();
        return { type: 'parenStart', value: '(' };
    }

    if (reader.peek() == ')') {
        reader.next();
        return { type: 'parenEnd', value: ')' };
    }

    return null;
}

export function readCodeBlocks(reader: CharacterReader) {
    if (reader.peek() == '{') {
        reader.next();
        return { type: 'codeBlockStart', value: '{' };
    }

    if (reader.peek() == '}') {
        reader.next();
        return { type: 'codeBlockEnd', value: '}' };
    }

    return null;
}

export function readEndOfLine(reader: CharacterReader) {
    if (reader.peek() == ';') {
        reader.next();
        return { type: 'endOfLine', value: ';' };
    }

    return null;
}

export function readComma(reader: CharacterReader) {
    if (reader.peek() == ',') {
        reader.next();
        return { type: 'comma', value: ',' };
    }
    return null;
}

export function readWhitespace(reader: CharacterReader){
    const whitespaceRegex = /[\t\r\n ]/;
    let value = '';
    while (reader.hasNext() && reader.peek().match(whitespaceRegex)) {
        value += reader.peek();
        reader.next();
    }

    if (value.length > 0) {
        return { type: 'whitespace', value };
    }
    return null;
}

export default [
    readComment,
    readNumberToken,
    readString,
    readOperator,
    readKeyword,
    readName,
    readParentheses,
    readCodeBlocks,
    readEndOfLine,
    readComma,
    readWhitespace,
];