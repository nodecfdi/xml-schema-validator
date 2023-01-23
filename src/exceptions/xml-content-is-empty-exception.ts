import { type XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class XmlContentIsEmptyException extends TypeError implements XmlSchemaValidatorException {
    public static create(): XmlContentIsEmptyException {
        return new XmlContentIsEmptyException('The xml contents is an empty string');
    }

    private constructor(message: string) {
        super(message);
    }
}
