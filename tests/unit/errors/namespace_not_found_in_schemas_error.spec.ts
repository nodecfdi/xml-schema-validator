import NamespaceNotFoundInSchemasError from '#src/errors/namespace_not_found_in_schemas_error';

describe('namespace not found in schemas error', () => {
  test('create', () => {
    const exception = NamespaceNotFoundInSchemasError.create('FOO');
    const expectedMessage = 'Namespace FOO does not exists in the schemas';

    expect(exception.message).toBe(expectedMessage);
    expect(exception.getNamespace()).toBe('FOO');
  });

  test('throws correctly', () => {
    const throwableFunction = (): void => {
      throw NamespaceNotFoundInSchemasError.create('FOO');
    };

    expect(throwableFunction).toThrow('Namespace FOO does not exists in the schemas');
  });
});
