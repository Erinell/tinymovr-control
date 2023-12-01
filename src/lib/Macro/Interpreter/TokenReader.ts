import type { Token } from "./Types";

export default class TokenReader {
    tokens: Array<Token>
    position: number
    stateStack: Array<number>

    constructor(tokens: Array<Token>) {
        this.tokens = tokens; // store tokens for further use
        this.position = 0; // current position in token list
        this.stateStack = []; // state stack so that we can rollback if we do not match something.
    }

    /**
     * Push current state to the stack
     */
    pushState() {
        this.stateStack.push(this.position);
    }

    /**
     * Restore position to the last state
     */
    restoreState() {
        this.position = this.popState();
    }

    /**
     * Remove the last state of the list
     * @return {number} Return the last state
     */
    popState() {
        return this.stateStack.pop() || 0;
    }

    /**
     * Checks whether the current token is of a specific type
     * @param {string} type The type to check
     * @return {boolean} Return the last state
     */
    isType(type: string) {
        return this.hasNext() && this.getType() === type;
    }

    /**
     * Return the type of the current token
     * @return {string} type
     */
    getType() {
        return this.get().type;
    }

    /**
     * Return the value of the current token
     * @return {string} value
     */
    getValue() {
        return this.get().value;
    }

    /**
     * Checks whether the value in the current token matches.
     * @return {string} value
     */
    isValue(value: string) {
        return this.getValue() === value;
    }

    /**
     * Returns the token at the current position.
     * @return {string} token
     */
    get() {
        return this.tokens[this.position];
    }

    /**
     * Returns the very last token of the list.
     * @return {Token} token
     */
    getLastToken() {
        return this.tokens[this.tokens.length - 1];
    }

    /**
     * Move to the next token.
     */
    next() {
        this.position++;
    }

    /**
     * Check and return whether there are more tokens to consume.
     * @return {boolean}
     */
    hasNext() {
        return this.position < this.tokens.length;
    }
}