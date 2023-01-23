/* eslint-disable unicorn/prevent-abbreviations */
import { LibXmlException } from '~/internal/lib-xml-exception';

describe('LibXmlException', () => {
    test('constructor with empty errors', () => {
        const t = (): LibXmlException => LibXmlException.create('foo', []);

        expect(t).toThrowError();
        expect(t).toThrow('Errors array of LibXmlError is empty');
    });

    test('create from lib-xml without any error returns null', () => {
        expect(LibXmlException.createFromLibXml()).toBeNull();
    });

    test('create from lib-xml with errors and throws', () => {
        const errors = [new SyntaxError('Error1'), new SyntaxError('Error2')];
        const functionWithErrorNotThrown = LibXmlException.createFromLibXml(errors, false);

        expect(functionWithErrorNotThrown).toBeInstanceOf(LibXmlException);
        expect(() => LibXmlException.createFromLibXml(errors, true)).toThrowError();
        expect(functionWithErrorNotThrown?.getErrors()).toEqual(errors);
    });
});
