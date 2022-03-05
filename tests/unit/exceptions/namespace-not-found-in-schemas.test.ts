import { NamespaceNotFoundInSchemas } from '../../../src';

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

        expect.hasAssertions();
        try {
            throwableFunction();
        } catch (e) {
            expect(e).toBeInstanceOf(RangeError);
            expect(e).toHaveProperty('message', 'Namespace FOO does not exists in the schemas');
            expect((e as NamespaceNotFoundInSchemas).getNamespace()).toBe('FOO');
        }
    });
});
