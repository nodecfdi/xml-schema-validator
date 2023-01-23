import { type XmlSchemaValidatorException } from './xml-schema-validator-exception';

export class NamespaceNotFoundInSchemas extends RangeError implements XmlSchemaValidatorException {
    public static create(namespace: string): NamespaceNotFoundInSchemas {
        return new NamespaceNotFoundInSchemas(`Namespace ${namespace} does not exists in the schemas`, namespace);
    }

    private readonly _namespace: string;

    private constructor(message: string, namespace: string) {
        super(message);
        this._namespace = namespace;
    }

    public getNamespace(): string {
        return this._namespace;
    }
}
