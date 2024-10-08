import 'jest-xml-matcher';
import Schema from '#src/schema';
import Schemas from '#src/schemas';
import { fileContent, filePath } from '../tests_utils.js';

describe('schemas', () => {
  const createSchemasWithCount = (count: number, ns: string, location: string): Schemas => {
    const schemas = new Schemas();
    for (let index = 0; index < count; index += 1) {
      schemas.create(`${ns}${index}`, `${location}${index}`);
    }

    return schemas;
  };

  test('empty object', () => {
    const schemas = new Schemas();

    expect(schemas).toHaveLength(0);
    expect(schemas).toHaveLength(0);
    expect(schemas.all().size).toBe(0);
    expect([...schemas]).toStrictEqual([]);
  });

  test('create and get item', () => {
    const ns = 'http://example.com';
    const location = 'http://example.com/xsd';
    const schemas = new Schemas();
    const schema = schemas.create(ns, location);

    expect(schemas).toHaveLength(1);
    expect(schema).toBeInstanceOf(Schema);
    expect(schema.getNamespace()).toBe(ns);
    expect(schema.getLocation()).toBe(location);
    expect(schemas.item(ns)).toBe(schema);
  });

  test('item non existent', () => {
    const ns = 'http://example.com';
    const schemas = new Schemas();

    const t = (): Schema => schemas.item(ns);

    expect(t).toThrow(Error);
    expect(t).toThrow(`Namespace ${ns} does not exists in the schemas`);
  });

  test('insert', () => {
    const ns = 'http://example.com';
    const location = 'http://example.com/xsd';
    const schemas = new Schemas();
    const schema = schemas.insert(new Schema(ns, location));

    expect(schema).toBeInstanceOf(Schema);
    expect(schemas).toHaveLength(1);
  });

  test('import', () => {
    const source = new Schemas();
    source.create('http://example.com/foo', 'foo.xsd');
    source.create('http://example.com/bar', 'bar.xsd');

    const schemas = new Schemas();
    schemas.create('http://example.com/xee', '001.xsd');
    schemas.create('http://example.com/foo', '002.xsd');

    schemas.import(source);
    for (const baseSchema of source.values()) {
      expect(schemas.exists(baseSchema.getNamespace())).toBeTruthy();
      expect(schemas.item(baseSchema.getNamespace())).toBe(baseSchema);
    }

    expect(schemas).toHaveLength(3);
  });

  test('insert several', () => {
    const ns = 'http://example.com/';
    const location = 'http://example.com/xsd/';

    const schemas = createSchemasWithCount(5, ns, location);
    expect(schemas).toHaveLength(5);

    schemas.create(`${ns}1`, `${location}X`);
    expect(schemas).toHaveLength(5);
    expect(schemas.item(`${ns}1`).getLocation()).toBe(`${location}X`);
  });

  test('remove', () => {
    const ns = 'http://example.com/';
    const location = 'http://example.com/xsd/';
    const schemas = createSchemasWithCount(7, ns, location);

    schemas.remove(`${ns}2`);
    expect(schemas.exists(`${ns}2`)).toBeFalsy();

    schemas.remove(`${ns}3`);
    expect(schemas.exists(`${ns}3`)).toBeFalsy();
    expect(schemas).toHaveLength(5);

    schemas.remove(`${ns}2`);
    expect(schemas).toHaveLength(5);
  });

  test('get importer xsd empty', () => {
    const baseFile = fileContent(filePath('include-template.xsd'));
    const schemas = new Schemas();

    expect(schemas.getImporterXsd()).toEqualXML(baseFile);
  });

  test('get importer xsd with contents', () => {
    const baseFile = fileContent(filePath('include-realurls.xsd'));
    const schemas = new Schemas();
    schemas.create(
      'http://www.sat.gob.mx/cfd/3',
      'http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv32.xsd',
    );
    schemas.create(
      'http://www.sat.gob.mx/TimbreFiscalDigital',
      'http://www.sat.gob.mx/TimbreFiscalDigital/TimbreFiscalDigital.xsd',
    );

    expect(schemas.getImporterXsd()).toEqualXML(baseFile);
  });

  test('get importer xsd with back slashes', () => {
    const schemas = new Schemas();
    schemas.create('http://tempuri.org/foo', String.raw`\C:\XSD\foo.xsd`);

    const expectedXml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">',
      '   <xs:import namespace="http://tempuri.org/foo" schemaLocation="/C:/XSD/foo.xsd"/>',
      '</xs:schema>',
    ].join('\n');

    expect(schemas.getImporterXsd()).toEqualXML(expectedXml);
  });

  test('iterator aggregate', () => {
    const data = [new Schema('a', 'aaa'), new Schema('b', 'bbb'), new Schema('c', 'ccc')];
    const schemas = new Schemas();
    for (const schema of data) {
      schemas.insert(schema);
    }

    let index = 0;
    for (const schema of schemas.values()) {
      expect(schema).toBe(data[index]);
      index += 1;
    }

    index = 0;
    for (const ns of schemas.keys()) {
      expect(ns).toBe(data[index].getNamespace());
      index += 1;
    }

    index = 0;
    for (const [ns, schema] of schemas.entries()) {
      expect(schema).toBe(data[index]);
      expect(ns).toBe(data[index].getNamespace());
      index += 1;
    }
  });
});
