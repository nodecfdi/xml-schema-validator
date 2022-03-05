import { SchemaLocationPartsNotEvenException } from '../../../src';

describe('SchemaLocationPartsNotEvenException', () => {
    test('create', () => {
        const parts = ['foo', 'bar', 'xee'];
        const exception = SchemaLocationPartsNotEvenException.create(parts);
        const expectedMessage = 'The schemaLocation attribute does not have even parts';

        expect(exception).toBeInstanceOf(Error);
        expect(exception.message).toBe(expectedMessage);
        expect(exception.getParts()).toBe(parts);
        expect(exception.getPartsAsString()).toBe('foo bar xee');
    });
});
