import { type Document, getParser, getSerializer, MIME_TYPE, type Node } from '@nodecfdi/cfdi-core';
import { parseXml } from 'libxmljs2';
import { useNamespaces } from 'xpath';
import {
  SchemaLocationPartsNotEvenError,
  ValidationFailError,
  XmlContentIsEmptyError,
  XmlContentIsInvalidError,
  type XmlSchemaValidatorError,
} from '#src/errors';
import LibXmlError from '#src/internal/lib_xml_error';
import Schemas from '#src/schemas';

export default class SchemaValidator {
  public static createFromString(contents: string): SchemaValidator {
    // Do not allow empty string
    if (contents === '') {
      throw XmlContentIsEmptyError.create();
    }

    let documentParse: Document | null = null;

    try {
      documentParse = getParser().parseFromString(contents, MIME_TYPE.XML_TEXT);
    } catch (error_) {
      const error = new SyntaxError(
        `Cannot create a Document from xml string, errors: ${JSON.stringify(error_)}`,
      );
      throw XmlContentIsInvalidError.create(error);
    }

    return new SchemaValidator(documentParse);
  }

  private readonly _document: Document;

  private _lastError = '';

  /**
   * SchemaValidator constructor.
   *
   * @param document -
   */
  public constructor(document: Document) {
    this._document = document;
  }

  /**
   * Validate the content by:
   * - Create the Schema´s collection from the document
   * - Validate using validate with schemas
   * - Populate the error property
   */
  public validate(_schemas?: Schemas): boolean {
    this._lastError = '';
    let schemas = _schemas;
    try {
      if (!schemas) {
        schemas = this.buildSchemas();
      }

      this.validateWithSchemas(schemas);
    } catch (error) {
      const ex = error as XmlSchemaValidatorError;
      this._lastError = ex.message;

      return false;
    }

    return true;
  }

  /**
   * Retrieve the last error message captured on the last validate operation
   */
  public getLastError(): string {
    return this._lastError;
  }

  /**
   * Validate against a list of schemas (if any)
   *
   * @param schemas -
   */
  public validateWithSchemas(schemas: Schemas): void {
    if (schemas.length === 0) {
      return;
    }

    // Build the unique import schema
    const xsdXml = schemas.getImporterXsd();
    const xmlTarget = getSerializer().serializeToString(this._document);
    const parsedXML = parseXml(xmlTarget);
    const parsedSchema = parseXml(xsdXml);
    const validationErrors = parsedXML.validate(parsedSchema) || parsedXML.validationErrors;

    if (validationErrors !== true) {
      throw ValidationFailError.create(LibXmlError.createFromLibXml(validationErrors) as Error);
    }
  }

  /**
   * Retrieve a list of namespaces based on the schemaLocation attributes
   *
   * @throws SchemaLocationPartsNotEvenException When the schemaLocation attribute does not have even parts
   */
  public buildSchemas(): Schemas {
    const schemas = new Schemas();

    // Get the http://www.w3.org/2001/XMLSchema-instance namespace (it could not be 'xsi')
    const xsi = this._document.documentElement?.lookupPrefix(
      'http://www.w3.org/2001/XMLSchema-instance',
    );

    if (!xsi) {
      // The namespace is not registered, no need continue
      return schemas;
    }

    // Get all the xsi:schemaLocation attributes in the document
    const namespaces = {
      [xsi]: 'http://www.w3.org/2001/XMLSchema-instance',
    };

    const selectWithNS = useNamespaces(namespaces);
    const schemasList = selectWithNS(
      `//@${xsi}:schemaLocation`,
      // @ts-expect-error misssing Node properties are not needed
      this._document.documentElement,
    ) as unknown as Node[];

    for (const schema of schemasList) {
      if (schema.nodeValue !== null) {
        schemas.import(this.buildSchemasFromSchemaLocationValue(schema.nodeValue));
      }
    }

    return schemas;
  }

  /**
   * Create a schema´s collection from the content of a schema location
   *
   * @param content -
   * @throws SchemaLocationPartsNotEvenException When the schemaLocation attribute does not have even parts
   */
  public buildSchemasFromSchemaLocationValue(content: string): Schemas {
    // Get parts without inner spaces
    const parts = content.split(/\s+/).filter((s) => s.length > 0);

    // Check that the list count is an even number
    if (parts.length % 2 !== 0) {
      throw SchemaLocationPartsNotEvenError.create(parts);
    }

    // Insert the uris pairs into the schemas
    const schemas = new Schemas();
    for (let k = 0; k < parts.length; k += 2) {
      schemas.create(parts[k], parts[k + 1]);
    }

    return schemas;
  }
}
