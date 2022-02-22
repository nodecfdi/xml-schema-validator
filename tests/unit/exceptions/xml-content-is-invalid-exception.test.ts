import { XmlContentIsInvalidException } from '../../../src/exceptions/xml-content-is-invalid-exception';

describe('XmlContentIsInvalidException', () => {
    test('create', () => {
        const previous = new Error('Previous exception');
        const exception = XmlContentIsInvalidException.create(previous);
        const expectedMessage = 'The xml contents cannot be loaded: Previous exception';

        expect(exception).toBeInstanceOf(TypeError);
        expect(exception.message).toBe(expectedMessage);
        expect(exception.getPrevious()).toBe(previous);
    });
});
