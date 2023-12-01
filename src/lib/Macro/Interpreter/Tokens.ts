import type CharacterReader from "./CharacterReader";

export function readComment(reader: CharacterReader) {
    if(reader.peek(2) == "//" || reader.peek(1) == "#") {
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
        return null; // if no string token was found
    }

    // return token of type string
    return { type: 'string', value };
}

export function readOperator(reader: CharacterReader) {
    // Regex for operator characters we want to detect.
    const operatorMatch = /^(!|\+|-|\*|\/|==|!=|&&|\|\||<|>|<=|>=|=|!=)$/;

    // Peek one character to detect one character operator
    const oneCharacterOperator = reader.peek();

    // Peek one character to detect two characters operator
    const twoCharacterOperator = reader.peek(2);

    let value = null;

    if (twoCharacterOperator.match(operatorMatch)) {
        reader.next(2);
        value = twoCharacterOperator; // two character operator was found
    } else if (oneCharacterOperator.match(operatorMatch)) {
        reader.next();
        value = oneCharacterOperator; // one character operator was found
    }

    if (value) {
        // Operator is found, we return the token.
        return { type: 'operator', value };
    }

    // Nothing was found so we return null that the token was not found.
    return null;
}

export function readName(reader: CharacterReader) {
    let value = '';
    const startOfVariableMatch = /[a-z]/;
    const restOfVariableMatch = /[a-zA-Z0-9]/;

    // If we did not match variable, do not return a token.
    if (!reader.peek().match(startOfVariableMatch)) {
        return null;
    }

    value = reader.peek();
    reader.next();

    while (reader.hasNext() && reader.peek().match(restOfVariableMatch)) {
        // add a character to value as long as we match the variable name.
        value += reader.peek();
        reader.next();
    }

    // we return a variable token
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

    // No keyword detected
    return null;
}

export function readParentheses(reader: CharacterReader) {
    if (reader.peek() == '(') {
        // We detected '(', start of parentheses
        reader.next();
        return { type: 'parenStart', value: '(' };
    }

    if (reader.peek() == ')') {
        // We detected ')', end of parentheses
        reader.next();
        return { type: 'parenEnd', value: ')' };
    }

    // No token was detected.
    return null;
}

export function readCodeBlocks(reader: CharacterReader) {
    if (reader.peek() == '{') {
        // We detected '{', start of code block
        reader.next();
        return { type: 'codeBlockStart', value: '{' };
    }

    if (reader.peek() == '}') {
        // We detected '}', end of code block
        reader.next();
        return { type: 'codeBlockEnd', value: '}' };
    }

    // No token was detected.
    return null;
}

export function readEndOfLine(reader: CharacterReader) {
    if (reader.peek() == ';') {
        // Semicolon is detected
        reader.next();
        return { type: 'endOfLine', value: ';' };
    }

    // Semicolon is not detected
    return null;
}

export function readComma(reader: CharacterReader) {
    if (reader.peek() == ',') {
        // Comma was detected
        reader.next();
        return { type: 'comma', value: ',' };
    }

    // Token was not detected.
    return null;
}

export function readWhitespace(reader: CharacterReader){
    const whitespaceRegex = /[\t\r\n ]/; // Regex for detecting whitespace.
    let value = '';
    while (reader.hasNext() && reader.peek().match(whitespaceRegex)) {
        // add detected whitespace to the value
        value += reader.peek();
        reader.next();
    }

    if (value.length > 0) {
        // Return detected whitespace.
        return { type: 'whitespace', value };
    }

    // No whitespace token was detected.
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