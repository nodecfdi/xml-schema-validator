import XmlSchemaValidatorError from '#src/errors/xml_schema_validator_error';

export default class NamespaceNotFoundInSchemasError extends XmlSchemaValidatorError {
  public static create(namespace: string): NamespaceNotFoundInSchemasError {
    return new NamespaceNotFoundInSchemasError(
      `Namespace ${namespace} does not exists in the schemas`,
      namespace,
    );
  }

  private readonly _namespace: string;

  private constructor(message: string, namespace: string) {
    super(message);
    this._namespace = namespace;
  }

  public getNamespace(): string {
    return this._namespace;
  }
}
