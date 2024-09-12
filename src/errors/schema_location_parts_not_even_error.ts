import XmlSchemaValidatorError from '#src/errors/xml_schema_validator_error';

export default class SchemaLocationPartsNotEvenError extends XmlSchemaValidatorError {
  public static create(parts: string[]): SchemaLocationPartsNotEvenError {
    return new SchemaLocationPartsNotEvenError(
      'The schemaLocation attribute does not have even parts',
      parts,
    );
  }

  private readonly _parts: string[];

  /**
   * SchemaLocationPartsNotEvenException constructor.
   *
   * @param message -
   * @param parts -
   */
  private constructor(message: string, parts: string[]) {
    super(message);
    this._parts = parts;
  }

  /**
   * Return the parts found on the schemaLocations attribute
   */
  public getParts(): string[] {
    return this._parts;
  }

  /**
   * Return the parts found on the schemaLocations attribute separated by a space
   */
  public getPartsAsString(): string {
    return this._parts.join(' ');
  }
}
