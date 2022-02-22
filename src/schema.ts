/**
 * Schema inmutable object, used by SchemaValidator and Schemas
 */
export class Schema {
    private readonly _namespace: string;
    private readonly _location: string;

    constructor(namespace: string, location: string) {
        this._namespace = namespace;
        this._location = location;
    }

    public getNamespace(): string {
        return this._namespace;
    }

    public getLocation(): string {
        return this._location;
    }
}
