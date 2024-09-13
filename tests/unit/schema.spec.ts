import Schema from '#src/schema';

describe('schema', () => {
  test('create object and read properties', () => {
    const schema = new Schema('a', 'b');
    expect(schema.getNamespace()).toBe('a');
    expect(schema.getLocation()).toBe('b');
  });
});
