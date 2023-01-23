import { type XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class XmlContentIsInvalidException extends TypeError implements XmlSchemaValidatorException {
    public static create(previous: Error): XmlContentIsInvalidException {
        return new XmlContentIsInvalidException(`The xml contents cannot be loaded: ${previous.message}`, previous);
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
