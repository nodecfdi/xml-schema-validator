import { XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class XmlContentIsEmptyException extends TypeError implements XmlSchemaValidatorException {
    private constructor(message: string) {
        super(message);
    }

    public static create(): XmlContentIsEmptyException {
        return new XmlContentIsEmptyException('The xml contents is an empty string');
    }
}
