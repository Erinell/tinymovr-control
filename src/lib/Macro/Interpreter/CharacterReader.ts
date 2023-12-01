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
            // if(this.peek() === '#') console.log(this.peek());
            if (this.code[i] == '\n') { // If a new line character is detected
                this.linePosition++; // Increase line position
                this.characterPosition = 0; // Reset character position as it is a new line.
                continue;
            }
            this.characterPosition++; // Increase character position for the line.
        }

        this.position += amount; // Change current reader position in code string.
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