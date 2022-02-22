import { TestCase } from '../TestCase';
import { DOMParser } from '@xmldom/xmldom';
import { XmlContentIsEmptyException, SchemaValidator, Schemas, ValidationFailException } from '../../src';

describe('SchemaValidators', () => {
    const utilCreateValidator = (file: string): SchemaValidator => {
        const contents = TestCase.fileContents(file);
        return SchemaValidator.createFromString(contents);
    };

    test('construct using existing document', () => {
        const docParse = new DOMParser().parseFromString(TestCase.fileContents('books-valid.xml'), 'text/xml');
        new SchemaValidator(docParse);

        expect(true).toBeTruthy();
    });

    test('constructor with empty string', () => {
        expect.hasAssertions();
        try {
            SchemaValidator.createFromString('');
        } catch (e) {
            expect(e).toBeInstanceOf(XmlContentIsEmptyException);
            expect(e).toHaveProperty('message', 'The xml contents is an empty string');
        }
    });

    test('validate with no schema', () => {
        const validator = utilCreateValidator('xml-without-schemas.xml');

        expect(validator.validate()).toBeTruthy();
    });

    test('validate with various whitespace in schema declaration', () => {
        const validator = utilCreateValidator('books-valid-with-extra-whitespace-in-schema-declaration.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError()).toBe('');
        expect(valid).toBeTruthy();
    });

    test('validate with not listed schema locations', () => {
        const validator = utilCreateValidator('not-listed-schemalocations.xml');
        const valid = validator.validate();

        expect(validator.getLastError()).toBe('');
        expect(valid).toBeTruthy();
    });

    test('validate with not even schema locations', () => {
        const validator = utilCreateValidator('not-even-schemalocations.xml');
        const valid = validator.validate();

        expect(validator.getLastError()).not.toBe('');
        expect(valid).toBeFalsy();
    });

    test('validate valid xml with schema', () => {
        const validator = utilCreateValidator('books-valid.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError()).toBe('');
        expect(valid).toBeTruthy();
    });

    test('validate valid xml with two schemas', () => {
        const validator = utilCreateValidator('ticket-valid.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/ticket', TestCase.filePublicPath('xsd/ticket.xsd'));
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError()).toBe('');
        expect(valid).toBeTruthy();
    });

    test('validate invalid xml only one schema', () => {
        const validator = utilCreateValidator('books-invalid.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError()).toContain("The attribute 'serie' is required but missing.");
        expect(valid).toBeFalsy();
    });

    test('validate invalid xml first schemas', () => {
        const validator = utilCreateValidator('ticket-invalid-ticket.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/ticket', TestCase.filePublicPath('xsd/ticket.xsd'));
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError()).toContain("The attribute 'notes' is required but missing");
        expect(valid).toBeFalsy();
    });

    test('validate invalid xml second schemas', () => {
        const validator = utilCreateValidator('ticket-invalid-book.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/ticket', TestCase.filePublicPath('xsd/ticket.xsd'));
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd'));
        const valid = validator.validate(schemas);

        expect(validator.getLastError().includes("The attribute 'serie' is required but missing")).toBeTruthy();
        expect(valid).toBeFalsy();
    });

    // test('validate with schemas using remote', () => {
    //     const validator = utilCreateValidator('books-valid.xml');
    //     const schemas = new Schemas();
    //     schemas.create('http://test.org/schemas/books', 'http://localhost:8999/xsd/books.xsd');
    //     validator.validateWithSchemas(schemas);
    //
    //     expect(true).toBeTruthy();
    // });

    test('validate with schemas using local', () => {
        const validator = utilCreateValidator('books-valid.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/books', TestCase.filePublicPath('xsd/books.xsd').replace('/', '\\'));
        validator.validateWithSchemas(schemas);

        expect(true).toBeTruthy();
    });

    test('validate with empty schema', () => {
        const validator = utilCreateValidator('books-valid.xml');
        const schemas = new Schemas();
        schemas.create('http://test.org/schemas/books', TestCase.filePath('empty.xsd'));

        expect.hasAssertions();
        try {
            validator.validateWithSchemas(schemas);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationFailException);
            expect(e).toHaveProperty('message', 'Schema validation failed: Invalid XSD schema');
        }
    });

    test('build schemas', () => {
        const expected = {
            'http://test.org/schemas/books': 'http://localhost:8999/xsd/books.xsd',
        };
        const validator = utilCreateValidator('books-valid.xml');
        const schemas = validator.buildSchemas();
        const retrieved: Record<string, string> = {};
        for (const schema of schemas.values()) {
            retrieved[schema.getNamespace()] = schema.getLocation();
        }

        expect(retrieved).toStrictEqual(expected);
    });

    test('build schemas form schema location value', () => {
        const validator = utilCreateValidator('books-valid.xml');
        const parts = ['uri:foo', 'foo.xsd', '  uri:bar', '\nbar.xsd', '\turi:xee \r\n', '\nxee.xsd \r\n'];
        const schemaLocationValue = parts.join(' ');
        const expectedParts = parts.map((x) => x.trim());
        const schemas = validator.buildSchemasFromSchemaLocationValue(schemaLocationValue);
        const retrievedParts: string[] = [];
        for (const schema of schemas.values()) {
            retrievedParts.push(schema.getNamespace());
            retrievedParts.push(schema.getLocation());
        }

        expect(retrievedParts).toStrictEqual(expectedParts);
    });
});
