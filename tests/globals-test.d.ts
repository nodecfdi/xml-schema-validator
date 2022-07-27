export {};

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualXML(xml: string): R;
        }
    }
}
