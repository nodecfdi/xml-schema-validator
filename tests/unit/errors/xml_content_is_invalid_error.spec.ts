import XmlContentIsInvalidError from '#src/errors/xml_content_is_invalid_error';

describe('xml content is invalid error', () => {
  test('create', () => {
    const previous = new Error('Previous exception');
    const exception = XmlContentIsInvalidError.create(previous);
    const expectedMessage = 'The xml contents cannot be loaded: Previous exception';

    expect(exception.message).toBe(expectedMessage);
    expect(exception.getPrevious()).toBe(previous);
  });
});
