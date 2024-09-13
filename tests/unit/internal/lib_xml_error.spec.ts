import { type ValidationError } from 'libxmljs2';
import LibXmlError from '#src/internal/lib_xml_error';

describe('lib xml error', () => {
  test('constructor with empty errors', () => {
    const t = (): LibXmlError => LibXmlError.create('foo', []);

    expect(t).toThrow('Errors array of LibXmlError is empty');
  });

  test('create from lib-xml without any error returns null', () => {
    expect(LibXmlError.createFromLibXml()).toBeNull();
  });

  test('create from lib xml with errors and throws', () => {
    const errors = [new SyntaxError('Error1'), new SyntaxError('Error2')] as ValidationError[];
    const functionWithErrorNotThrown = LibXmlError.createFromLibXml(errors, false);

    expect(functionWithErrorNotThrown).toBeInstanceOf(LibXmlError);
    expect(() => LibXmlError.createFromLibXml(errors, true)).toThrow(Error);
    expect(functionWithErrorNotThrown?.getErrors()).toStrictEqual(errors);
  });
});
