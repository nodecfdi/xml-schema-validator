import { getParser, getSerializer } from '@nodecfdi/cfdiutils-common';
import { useNamespaces } from 'xpath';
import { parseXml } from 'libxmljs2';

import { XmlContentIsInvalidException } from './exceptions/xml-content-is-invalid-exception';
import { XmlContentIsEmptyException } from './exceptions/xml-content-is-empty-exception';
import { Schemas } from './schemas';
import { SchemaLocationPartsNotEvenException } from './exceptions/schema-location-parts-not-even-exception';
import { ValidationFailException } from './exceptions/validation-fail-exception';
import { XmlSchemaValidatorException } from './exceptions/xml-schema-validator-exception';
import { LibXmlException } from './internal/lib-xml-exception';

export class SchemaValidator {
    private readonly _document: Document;

    private _lastError = '';

    /**
     * SchemaValidator constructor.
     *
     * @param document -
     */
    constructor(document: Document) {
        this._document = document;
    }

    public static createFromString(contents: string): SchemaValidator {
        // do not allow empty string
        if ('' == contents) {
            throw XmlContentIsEmptyException.create();
        }

        let docParse: Document | null = null;
        const errors: Record<string, unknown> = {};
        const parser = getParser();
        // Only for @xmldom/xmldom capture not error fatal
        if ((parser as unknown as Record<string, unknown>).options) {
            (parser as unknown as Record<string, Record<string, unknown>>).options = {
                errorHandler: (level: string, msg: unknown): void => {
                    errors[level] = msg;
                },
                locator: {}
            };
        }

        try {
            docParse = parser.parseFromString(contents, 'text/xml');

            if (Object.keys(errors).length !== 0 || !docParse.documentElement) {
                throw new Error('Invalid xml');
            }
        } catch (e) {
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
     * @param schemas -
     */
    public validateWithSchemas(schemas: Schemas): void {
        if (0 == schemas.length) return;

        // build the unique import schema
        const xsdXml = schemas.getImporterXsd();

        try {
            const xsdDoc = parseXml(xsdXml);
            const xmlTarget = parseXml(getSerializer().serializeToString(this._document));
            xmlTarget.validate(xsdDoc);
            LibXmlException.createFromLibXml(xmlTarget.validationErrors, true);
        } catch (e) {
            throw ValidationFailException.create(e as Error);
        }
    }

    /**
     * Retrieve a list of namespaces based on the schemaLocation attributes
     *
     * @throws SchemaLocationPartsNotEvenException When the schemaLocation attribute does not have even parts
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
            [`${xsi}`]: 'http://www.w3.org/2001/XMLSchema-instance'
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
     * @param content -
     * @throws SchemaLocationPartsNotEvenException When the schemaLocation attribute does not have even parts
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
