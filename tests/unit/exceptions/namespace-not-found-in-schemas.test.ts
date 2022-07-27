import { NamespaceNotFoundInSchemas } from '~/exceptions/namespace-not-found-in-schemas';

describe('NamespaceNotFoundInSchemas', () => {
    test('create', () => {
        const exception = NamespaceNotFoundInSchemas.create('FOO');
        const expectedMessage = 'Namespace FOO does not exists in the schemas';

        expect(exception).toBeInstanceOf(RangeError);
        expect(exception.message).toBe(expectedMessage);
        expect(exception.getNamespace()).toBe('FOO');
    });

    test('throws correctly', () => {
        const throwableFunction = (): void => {
            throw NamespaceNotFoundInSchemas.create('FOO');
        };

        expect(throwableFunction).toThrow(RangeError);
        expect(throwableFunction).toThrow('Namespace FOO does not exists in the schemas');
    });
});
