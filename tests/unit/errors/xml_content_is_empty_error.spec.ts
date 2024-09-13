import XmlContentIsEmptyError from '#src/errors/xml_content_is_empty_error';

describe('xml content is empty error', () => {
  test('create', () => {
    const exception = XmlContentIsEmptyError.create();
    const expectedMessage = 'The xml contents is an empty string';

    expect(exception.message).toBe(expectedMessage);
  });
});
