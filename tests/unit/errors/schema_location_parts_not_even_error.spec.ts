import SchemaLocationPartsNotEvenError from '#src/errors/schema_location_parts_not_even_error';

describe('schema location parts not even error', () => {
  test('create', () => {
    const parts = ['foo', 'bar', 'xee'];
    const exception = SchemaLocationPartsNotEvenError.create(parts);
    const expectedMessage = 'The schemaLocation attribute does not have even parts';

    expect(exception.message).toBe(expectedMessage);
    expect(exception.getParts()).toBe(parts);
    expect(exception.getPartsAsString()).toBe('foo bar xee');
  });
});
