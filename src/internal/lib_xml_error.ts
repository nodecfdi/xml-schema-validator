import { type ValidationError } from 'libxmljs2';

export default class LibXmlError extends Error {
  /**
   * Create an instance with the provided information
   */
  public static create(message: string, errors: ValidationError[]): LibXmlError {
    return new LibXmlError(message, errors);
  }

  /**
   * Create a LibXmlException based on errors in libxml.
   * If found, chain all the error messages
   */
  public static createFromLibXml(
    errors?: ValidationError[],
    withThrown = false,
  ): LibXmlError | null {
    if (!errors || errors.length === 0) {
      return null;
    }

    const lastError = errors.at(-1)!;
    const error = LibXmlError.create(
      `${lastError.message} Detail: { column: ${lastError.column}, line: ${lastError.line} }`,
      errors,
    );

    if (withThrown) {
      throw error;
    }

    return error;
  }

  private readonly errors: ValidationError[];

  /**
   * LibXmlException constructor
   */
  private constructor(message: string, errors: ValidationError[]) {
    if (errors.length === 0) {
      throw new Error('Errors array of LibXmlError is empty');
    }

    super(message);
    this.errors = errors;
  }

  public getErrors(): ValidationError[] {
    return this.errors;
  }
}
