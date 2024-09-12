import XmlSchemaValidatorError from '#src/errors/xml_schema_validator_error';

export default class XmlContentIsEmptyError extends XmlSchemaValidatorError {
  public static create(): XmlContentIsEmptyError {
    return new XmlContentIsEmptyError('The xml contents is an empty string');
  }

  private constructor(message: string) {
    super(message);
  }
}
