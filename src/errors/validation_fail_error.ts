import XmlSchemaValidatorError from '#src/errors/xml_schema_validator_error';

export default class ValidationFailError extends XmlSchemaValidatorError {
  public static create(previous: Error): ValidationFailError {
    return new ValidationFailError(`Schema validation failed: ${previous.message}`, previous);
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
