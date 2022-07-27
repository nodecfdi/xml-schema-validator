import { ValidationFailException } from '~/exceptions/validation-fail-exception';

describe('ValidationFailException', () => {
    test('create', () => {
        const previous = new Error('Previous exception');
        const exception = ValidationFailException.create(previous);
        const expectedMessage = 'Schema validation failed: Previous exception';

        expect(exception).toBeInstanceOf(Error);
        expect(exception.message).toBe(expectedMessage);
        expect(exception.getPrevious()).toBe(previous);
    });
});
