import type TokenReader from "./TokenReader";

export const rule = (getChecks: any, onMatch: any) => (reader: TokenReader) => {
    
    const checkRule = getChecks();

    const result = checkRule(reader);
    return result ? onMatch(result) : null;
};

export const not = (check: any) => (reader: TokenReader) => {
    reader.pushState();
    try {
        const match = check(reader);
        if (!match) {
            return true;
        }
    } catch (error) {
        return true;
    }
    reader.popState();
    return null;
}

export const exactly = (...checks: any) => (reader: TokenReader) => {
    reader.pushState();
    const results = [];

    for (const check of checks) {
        const match = check(reader);

        if (!match) {
            reader.restoreState();
            return null;
        }
        results.push(match);
    }
    reader.popState();
    return results;
};

export const either = (...checks: any) => (reader: TokenReader) => {
    for (const check of checks) {
        reader.pushState();
        const match = check(reader);
        if (match) {
            reader.popState();
            return match;
        }

        reader.restoreState();
    }

    return null;
};

export const optional = (check: any, defaultValue: any = { type: 'optional' }) => (reader: TokenReader) => {
    reader.pushState();
    const result = check(reader);
    if (!result) {
        reader.restoreState();
    } else {
        reader.popState();
    }
    return result ? result : defaultValue;
};

export const minOf = (minAmount: number, check: any) => (reader: TokenReader) => {
    reader.pushState();
    const results = [];
    let result = null;
    while (true) {
        result = check(reader);
        if (!result) {
            if (results.length < minAmount) {
                reader.restoreState();
                return null;
            }
            break;
        }
        results.push(result);
    }
    reader.popState();
    return results;
};

export const token = (type: string, value: string | null = null) => (reader: TokenReader) => {
    let valueMatches = value ? reader.isValue(value) : true;

    if (reader.isType(type) && valueMatches) {
        const result = reader.get();
        reader.next();
        return result;
    };
    return null;

};