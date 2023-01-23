import { type XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class ValidationFailException extends Error implements XmlSchemaValidatorException {
    public static create(previous: Error): ValidationFailException {
        return new ValidationFailException(`Schema validation failed: ${previous.message}`, previous);
    }

    private readonly _previous: Error;

    private constructor(message: string, previous: Error) {
        super(message);
        this._previous = previous;
    }

    public getPrevious(): Error {
        return this._previous;
    }
}
