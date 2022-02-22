import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { XmlContentIsInvalidException } from './exceptions/xml-content-is-invalid-exception';
import { XmlContentIsEmptyException } from './exceptions/xml-content-is-empty-exception';
import { Schemas } from './schemas';
import { SchemaLocationPartsNotEvenException } from './exceptions/schema-location-parts-not-even-exception';
import { useNamespaces } from 'xpath';
import * as xsd from 'libxmljs2-xsd';
import { ValidationFailException } from './exceptions/validation-fail-exception';
import { XmlSchemaValidatorException } from './exceptions/xml-schema-validator-exception';
import { LibXmlException } from './internal/LibXmlException';

export class SchemaValidator {
    private readonly _document: Document;
    private _lastError = '';
    private _schemaValidator?: xsd.SchemaXSD;

    /**
     * SchemaValidator constructor.
     *
     * @param document
     */
    constructor(document: Document) {
        this._document = document;
    }

    public static createFromString(contents: string): SchemaValidator {
        // do not allow empty string
        if ('' == contents) {
            throw XmlContentIsEmptyException.create();
        }
        const errors: Record<string, unknown> = {};
        const parser = new DOMParser({
            errorHandler: (level, msg): void => {
                errors[level] = msg;
            },
        });
        const docParse = parser.parseFromString(contents, 'text/xml');
        if (Object.keys(errors).length !== 0) {
            const error = SyntaxError(`Cannot create a Document from xml string, errors: ${JSON.stringify(errors)}`);
            throw XmlContentIsInvalidException.create(error);
        }
        return new SchemaValidator(docParse);
    }

    /**
     * Validate the content by:
     * - Create the Schema´s collection from the document
     * - Validate using validate with schemas
     * - Populate the error property
     */
    public validate(schemas?: Schemas): boolean {
        this._lastError = '';
        try {
            if (!schemas) {
                schemas = this.buildSchemas();
            }
            this.validateWithSchemas(schemas);
            const validationErrors = this._schemaValidator?.validate(
                new XMLSerializer().serializeToString(this._document)
            );
            LibXmlException.createFromLibXml(validationErrors, true);
        } catch (e) {
            const ex = e as XmlSchemaValidatorException;
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
     * @param schemas
     */
    public validateWithSchemas(schemas: Schemas): void {
        if (0 == schemas.length) return;

        // build the unique import schema
        const xsdXml = schemas.getImporterXsd();

        try {
            this._schemaValidator = xsd.parse(xsdXml);
        } catch (e) {
            throw ValidationFailException.create(e as Error);
        }
    }

    /**
     * Retrieve a list of namespaces based on the schemaLocation attributes
     *
     * @throws {SchemaLocationPartsNotEvenException} When the schemaLocation attribute does not have even parts
     */
    public buildSchemas(): Schemas {
        const schemas = new Schemas();

        // get the http://www.w3.org/2001/XMLSchema-instance namespace (it could not be 'xsi')
        const xsi = this._document.documentElement.lookupPrefix('http://www.w3.org/2001/XMLSchema-instance');

        if (!xsi) {
            // the namespace is not registered, no need continue
            return schemas;
        }

        // get all the xsi:schemaLocation attributes in the document
        const namespaces = {
            [`${xsi}`]: 'http://www.w3.org/2001/XMLSchema-instance',
        };

        const selectWithNS = useNamespaces(namespaces);
        const schemasList = selectWithNS(
            `//@${xsi}:schemaLocation`,
            this._document.documentElement
        ) as unknown as NodeList;

        schemasList.forEach((schema) => {
            schemas.import(this.buildSchemasFromSchemaLocationValue(schema.nodeValue || ''));
        });

        return schemas;
    }

    /**
     * Create a schema´s collection from the content of a schema location
     *
     * @param content
     * @throws {SchemaLocationPartsNotEvenException} When the schemaLocation attribute does not have even parts
     */
    public buildSchemasFromSchemaLocationValue(content: string): Schemas {
        // get parts without inner spaces
        const parts = content.split(/\s+/).filter((s) => s.length !== 0);

        // check that the list count is an even number
        if (0 !== parts.length % 2) {
            throw SchemaLocationPartsNotEvenException.create(parts);
        }

        //insert the uris pairs into the schemas
        const schemas = new Schemas();
        for (let k = 0; k < parts.length; k = k + 2) {
            schemas.create(parts[k], parts[k + 1]);
        }
        return schemas;
    }
}
