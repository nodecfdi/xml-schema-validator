/* eslint-disable unicorn/prevent-abbreviations */
export class LibXmlException extends Error {
    /**
     * Create an instance with the provided information
     *
     * @param message -
     * @param errors -
     */
    public static create(message: string, errors: SyntaxError[]): LibXmlException {
        return new LibXmlException(message, errors);
    }

    /**
     * Create a LibXmlException based on errors in libxml.
     * If found, chain all the error messages
     *
     * @param errors -
     * @param withThrown -
     */
    public static createFromLibXml(errors?: SyntaxError[] | null, withThrown = false): LibXmlException | null {
        if (!errors || errors.length === 0) {
            return null;
        }

        const lastError = errors[errors.length - 1];
        if (withThrown) {
            throw LibXmlException.create(lastError.message, errors);
        }

        return LibXmlException.create(lastError.message, errors);
    }

    private readonly errors: SyntaxError[];

    /**
     * LibXmlException constructor
     *
     * @param message -
     * @param errors -
     */
    private constructor(message: string, errors: SyntaxError[]) {
        if (errors.length === 0) {
            throw new Error('Errors array of LibXmlError is empty');
        }

        super(message);
        this.errors = errors;
    }

    public getErrors(): SyntaxError[] {
        return this.errors;
    }
}
