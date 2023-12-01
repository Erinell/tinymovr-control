import { LineStatement } from "./Grammar"
import TokenReader from "./TokenReader";
import type { Token } from "./Types";

export default function parseTokens(tokens: Array<Token>) {
    const reader = new TokenReader(tokens);
    const statements = [];
    
    while (reader.hasNext()) {
        let token = reader.get();
        
        try {
            const statement = LineStatement(reader);
        
            if (statement) {
                statements.push(statement);
                continue;
            }
    
            let token = reader.hasNext() ? reader.get() : reader.getLastToken();
            throw new Error(`Syntax error on ${token.line}:${token.character} for "${token.value}". Expected an assignment, function call or an if statement.`);
    
        } catch (error) {
            let token = reader.hasNext() ? reader.get() : reader.getLastToken();
            throw new Error(`Syntax error on ${token.line}:${token.character} for "${token.value}".`);
        }
    }

    return statements;
};