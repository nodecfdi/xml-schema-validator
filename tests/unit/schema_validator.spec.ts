import { type Server } from 'node:http';
import { getParser, MIME_TYPE } from '@nodecfdi/cfdi-core';
import SchemaValidator from '#src/schema_validator';
import Schemas from '#src/schemas';
import { fileContent, filePath, server } from '../tests_utils.js';

describe('schema validators', () => {
  const utilCreateValidator = (file: string): SchemaValidator => {
    const contents = fileContent(filePath(file));

    return SchemaValidator.createFromString(contents);
  };

  let serverApp: Server;

  beforeAll(async () => {
    serverApp = server;
    await new Promise((resolve, reject) => {
      serverApp.listen(3000).on('listening', resolve).on('error', reject);
    });
  });

  afterAll(() => {
    serverApp.close();
  });

  test('construct using existing document', () => {
    const documentParse = getParser().parseFromString(
      fileContent(filePath('books-valid.xml')),
      MIME_TYPE.XML_TEXT,
    );
    const t = (): SchemaValidator => new SchemaValidator(documentParse);

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
      '</book>',
    ].join('\n');
    const t = (): SchemaValidator => SchemaValidator.createFromString(xmlString);

    expect(t).toThrow(Error);
    expect(t).toThrow(
      String.raw`The xml contents cannot be loaded: Cannot create a Document from xml string, errors: {"message":"Opening and ending tag mismatch: \"tag\" != \"book\""}`,
    );
  });

  test('validate with no schema', () => {
    const validator = utilCreateValidator('xml-without-schemas.xml');

    expect(validator.validate()).toBeTruthy();
  });

  test('validate with various whitespace in schema declaration', () => {
    const validator = utilCreateValidator(
      'books-valid-with-extra-whitespace-in-schema-declaration.xml',
    );
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
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
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
    const valid = validator.validate(schemas);

    expect(validator.getLastError()).toBe('');
    expect(valid).toBeTruthy();
  });

  test('validate valid xml with two schemas', () => {
    const validator = utilCreateValidator('ticket-valid.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/ticket', filePath('xsd/ticket.xsd', true));
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
    const valid = validator.validate(schemas);

    expect(validator.getLastError()).toBe('');
    expect(valid).toBeTruthy();
  });

  test('validate invalid xml only one schema', () => {
    const validator = utilCreateValidator('books-invalid.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
    const valid = validator.validate(schemas);

    expect(validator.getLastError()).toContain("The attribute 'serie' is required but missing.");
    expect(valid).toBeFalsy();
  });

  test('validate invalid xml first schemas', () => {
    const validator = utilCreateValidator('ticket-invalid-ticket.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/ticket', filePath('xsd/ticket.xsd', true));
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
    const valid = validator.validate(schemas);

    expect(validator.getLastError()).toContain("The attribute 'notes' is required but missing");
    expect(valid).toBeFalsy();
  });

  test('validate invalid xml second schemas', () => {
    const validator = utilCreateValidator('ticket-invalid-book.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/ticket', filePath('xsd/ticket.xsd', true));
    schemas.create('http://test.org/schemas/books', filePath('xsd/books.xsd', true));
    const valid = validator.validate(schemas);

    expect(
      validator.getLastError().includes("The attribute 'serie' is required but missing"),
    ).toBeTruthy();
    expect(valid).toBeFalsy();
  });

  test('validate with schemas using remote', () => {
    const validator = utilCreateValidator('books-valid.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/books', 'http://localhost:3000/xsd/books.xsd');
    validator.validateWithSchemas(schemas);

    expect(true).toBeTruthy();
  });

  test('validate with schemas using local', () => {
    const validator = utilCreateValidator('books-valid.xml');
    const schemas = new Schemas();
    schemas.create(
      'http://test.org/schemas/books',
      filePath('xsd/books.xsd', true).replace('/', '\\'),
    );
    validator.validateWithSchemas(schemas);

    expect(true).toBeTruthy();
  });

  test('validate with empty schema', () => {
    const validator = utilCreateValidator('books-valid.xml');
    const schemas = new Schemas();
    schemas.create('http://test.org/schemas/books', filePath('empty.xsd'));

    const t = (): void => {
      validator.validateWithSchemas(schemas);
    };

    expect(t).toThrow(Error);
    expect(t).toThrow('Invalid XSD schema');
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
    const parts = [
      'uri:foo',
      'foo.xsd',
      '  uri:bar',
      '\nbar.xsd',
      '\turi:xee \r\n',
      '\nxee.xsd \r\n',
    ];
    const schemaLocationValue = parts.join(' ');
    const expectedParts = parts.map((x) => x.trim());
    const schemas = validator.buildSchemasFromSchemaLocationValue(schemaLocationValue);
    const retrievedParts: string[] = [];
    for (const schema of schemas.values()) {
      retrievedParts.push(schema.getNamespace(), schema.getLocation());
    }

    expect(retrievedParts).toStrictEqual(expectedParts);
  });
});
