import tokenDetectors from "./Tokens";
import CharacterReader from "./CharacterReader";

export default function detectTokens(code: string){
    const reader = new CharacterReader(code);

    const foundTokens: Array<any> = [];

    while (reader.hasNext()) {
        let token = null;

        let startPosition = reader.position;
        let linePosition = reader.getLinePosition();
        let characterPosition = reader.getCharacterPosition();

        for (const detectToken of tokenDetectors) {
            token = detectToken(reader);
            if (token) break;
        }

        if (!token) {
            throw new Error(`Invalid character '${reader.peek()}' at ${linePosition}:${characterPosition}`);
        }
        
        foundTokens.push({
            ...token,
            start: startPosition,
            end: reader.position,
            line: linePosition,
            character: characterPosition
        });
    }

    // remove whitespace because we will not use them.
    return foundTokens.filter(i => i.type !== 'whitespace');
};