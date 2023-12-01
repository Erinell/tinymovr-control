export default class CharacterReader {
    code: string;
    characterPosition: number;
    linePosition: number;
    position: number;

    constructor(code: string) {
        this.code = code;
        this.characterPosition = 0;
        this.linePosition = 0;
        this.position = 0;
    }

    /**
    * Get the character at current position
    * @param {number} amount the number of character to get (default=1)
    * @return {string}
    */
    peek(amount: number = 1): string {
        return this.code.substring(this.position, this.position + amount);
    }

    /**
    * Move to the next character
    * @param {number} amount the number of character to jump (default=1)
    */
    next(amount = 1) {
        for (let i = this.position; i < this.position + amount; i++) {
            if (this.code[i] == '\n') {
                this.linePosition++; 
                this.characterPosition = 0;
                continue;
            }
            this.characterPosition++;
        }
        this.position += amount;
    }

    /**
     * Return the current position of the character.
     * @return {number}
     */
    getCharacterPosition() {
        return this.characterPosition;
    }

    /**
     * Return the current line position.
     * @return {number}
     */
    getLinePosition() {
        return this.linePosition;
    }

    /**
     * Return false if at the end of the code.
     * @return {boolean}
     */
    hasNext() {
        return this.position < this.code.length;
    }
}