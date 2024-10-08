/**
 * Schema inmutable object, used by SchemaValidator and Schemas
 */
export default class Schema {
  private readonly _namespace: string;

  private readonly _location: string;

  public constructor(namespace: string, location: string) {
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
