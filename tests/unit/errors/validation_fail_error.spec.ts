import ValidationFailError from '#src/errors/validation_fail_error';

describe('validation fail exception', () => {
  test('create', () => {
    const previous = new Error('Previous exception');
    const exception = ValidationFailError.create(previous);
    const expectedMessage = 'Schema validation failed: Previous exception';

    expect(exception.message).toBe(expectedMessage);
    expect(exception.getPrevious()).toBe(previous);
  });
});
