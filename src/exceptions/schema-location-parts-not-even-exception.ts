import { XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class SchemaLocationPartsNotEvenException extends Error implements XmlSchemaValidatorException {
    private readonly _parts: string[];

    /**
     * SchemaLocationPartsNotEvenException constructor.
     *
     * @param message
     * @param parts
     * @private
     */
    private constructor(message: string, parts: string[]) {
        super(message);
        this._parts = parts;
    }

    public static create(parts: string[]): SchemaLocationPartsNotEvenException {
        return new SchemaLocationPartsNotEvenException('The schemaLocation attribute does not have even parts', parts);
    }

    /**
     * Return the parts found on the schemaLocations attribute
     */
    public getParts(): string[] {
        return this._parts;
    }

    /**
     * Return the parts found on the schemaLocations attribute separated by a space
     */
    public getPartsAsString(): string {
        return this._parts.join(' ');
    }
}
