import { getParser, install } from '@nodecfdi/cfdiutils-common';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';

import { TestCase } from '../test-case';
import { Schemas } from '~/schemas';
import { SchemaValidator } from '~/schema-validator';

describe('SchemaValidators', () => {
    const utilCreateValidator = (file: string): SchemaValidator => {
        const contents = TestCase.fileContents(file);

        return SchemaValidator.createFromString(contents);
    };

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('construct using existing document', () => {
        const docParse = getParser().parseFromString(TestCase.fileContents('books-valid.xml'), 'text/xml');
        const t = (): SchemaValidator => new SchemaValidator(docParse);

        expect(t()).toBeInstanceOf(SchemaValidator);
    });

    test('constructor with empty string', () => {
        const t = (): SchemaValidator => SchemaValidator.createFromString('');

        expect(t).toThrow(Error);
        expect(t).toThrow('The xml contents is an empty string');
    });

    test('constructor with bad xml string', () => {
        const xmlString = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<book>',
            '    <tag>This element does not have a closing tag',
            '</book>'
        ].join('\n');
        const t = (): SchemaValidator => SchemaValidator.createFromString(xmlString);

        expect(t).toThrow(Error);
        expect(t).toThrow(
            'The xml contents cannot be loaded: Cannot create a Document from xml string, errors: {"warning":"[xmldom warning]\\tunclosed xml attribute\\n@#[line:3,col:5]"}'
        );
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

        const t = (): void => validator.validateWithSchemas(schemas);

        expect(t).toThrow(Error);
        expect(t).toThrow('Schema validation failed: Invalid XSD schema');
    });

    test('build schemas', () => {
        const expected = {
            'http://test.org/schemas/books': 'http://localhost:8999/xsd/books.xsd'
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
