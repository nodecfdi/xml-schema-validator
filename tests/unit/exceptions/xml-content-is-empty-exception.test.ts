import { XmlContentIsEmptyException } from '../../../src';

describe('XmlContentIsEmptyException', () => {
    test('create', () => {
        const exception = XmlContentIsEmptyException.create();
        const expectedMessage = 'The xml contents is an empty string';

        expect(exception).toBeInstanceOf(TypeError);
        expect(exception.message).toBe(expectedMessage);
    });
});
