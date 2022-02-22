import { Schema } from './schema';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { NamespaceNotFoundInSchemas } from './exceptions/namespace-not-found-in-schemas';

export class Schemas {
    /** Internal collection of schemas */
    private readonly _schemas = new Map<string, Schema>();

    /**
     * Return the XML of a Xsd that includes all the namespaces
     * with the local location
     */
    public getImporterXsd(): string {
        const xsd = new DOMParser().parseFromString(
            '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"/>',
            'text/xml'
        );
        const pi = xsd.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
        xsd.insertBefore(pi, xsd.firstChild);
        const document = xsd.documentElement;
        this._schemas.forEach((schema) => {
            const node = xsd.createElementNS('http://www.w3.org/2001/XMLSchema', 'import');
            node.setAttribute('namespace', schema.getNamespace());
            node.setAttribute('schemaLocation', schema.getLocation().replace(/\\/g, '/'));
            document.appendChild(node);
        });
        return new XMLSerializer().serializeToString(xsd);
    }

    /**
     * Create a new schema and inserts it to the collection
     * The returned object is the created schema
     *
     * @param namespace
     * @param location
     */
    public create(namespace: string, location: string): Schema {
        return this.insert(new Schema(namespace, location));
    }

    /**
     * Insert (add or replace) a schema to the collection
     * The returned object is the same schema
     *
     * @param schema
     */
    public insert(schema: Schema): Schema {
        this._schemas.set(schema.getNamespace(), schema);
        return schema;
    }

    /**
     * Import the schemas from other schema collection to this collection
     *
     * @param schemas
     */
    public import(schemas: Schemas): void {
        for (const schema of schemas.values()) {
            this.insert(schema);
        }
    }

    /**
     * Remove a schema based on its namespace
     *
     * @param namespace
     */
    public remove(namespace: string): void {
        this._schemas.delete(namespace);
    }

    /**
     * Return the complete collection of schemas as Map<string, Schema>
     */
    public all(): Map<string, Schema> {
        return this._schemas;
    }

    /**
     * Check if a schema exists by its namespace
     *
     * @param namespace
     */
    public exists(namespace: string): boolean {
        return this._schemas.has(namespace);
    }

    public item(namespace: string): Schema {
        const schema = this._schemas.get(namespace);
        if (!schema) {
            throw NamespaceNotFoundInSchemas.create(namespace);
        }
        return schema;
    }

    public get length(): number {
        return this._schemas.size;
    }

    // iterators of schemas
    public [Symbol.iterator](): IterableIterator<[string, Schema]> {
        return this._schemas[Symbol.iterator]();
    }

    public entries(): IterableIterator<[string, Schema]> {
        return this._schemas.entries();
    }

    public keys(): IterableIterator<string> {
        return this._schemas.keys();
    }

    public values(): IterableIterator<Schema> {
        return this._schemas.values();
    }
}
