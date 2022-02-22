import { XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class XmlContentIsInvalidException extends TypeError implements XmlSchemaValidatorException {
    private readonly _previous: Error;

    private constructor(message: string, previous: Error) {
        super(message);
        this._previous = previous;
    }

    public static create(previous: Error): XmlContentIsInvalidException {
        return new XmlContentIsInvalidException(`The xml contents cannot be loaded: ${previous.message}`, previous);
    }

    public getPrevious(): Error {
        return this._previous;
    }
}
