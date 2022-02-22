import { XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class ValidationFailException extends Error implements XmlSchemaValidatorException {
    private readonly _previous: Error;

    private constructor(message: string, previous: Error) {
        super(message);
        this._previous = previous;
    }

    public static create(previous: Error): ValidationFailException {
        return new ValidationFailException(`Schema validation failed: ${previous.message}`, previous);
    }

    public getPrevious(): Error {
        return this._previous;
    }
}
