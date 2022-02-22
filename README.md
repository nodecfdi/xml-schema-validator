# @nodecfdi/xml-schema-validator

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/xml-schema-validator

[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fxml--schema--validator-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D

[license]: https://github.com/nodecfdi/xml-schema-validator/blob/main/LICENSE

[badge-license]: https://img.shields.io/github/license/nodecfdi/xml-schema-validator?logo=open-source-initiative&style=flat-square

[badge-release]: https://img.shields.io/npm/v/@nodecfdi/xml-schema-validator

[release]: https://www.npmjs.com/package/@nodecfdi/xml-schema-validator

[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square

[discord]: https://discord.gg/aFGYXvX

> Library for XML Schema Validations

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de @nodecfdi/xml-schema-validator

Esta es una librería para validar archivos XML a través de multiples Esquemas XSD acorde a sus definiciones.

1. Recibe un string xml válido con el contenido a ser evaluado.
2. Escanear el archivo por cada schemaLocation.
3. Generar un esquema que incluya todos los esquemas.
4. Validar el xml nuevamente con el esquema generado.

Librería inspirada por la versión para php https://github.com/eclipxe13/XmlSchemaValidator

## Advertencia

Actualmente solo está soportada la carga de esquema local, no funciona con esquemas remotos, debido a incompatibilidad
con la lib actual.

## Instalación

```shell
npm i @nodecfdi/cfdi-cleaner --save
```

o

```shell
yarn add @nodecfdi/cfdi-cleaner
```

## Ejemplo básico de uso

```ts
import { readFileSync } from 'fs';
import { SchemaValidator } from "@nodecfdi/xml-schema-validator";

const contents = readFileSync('example.xml', 'binary');

// expect references on schemalocations are locally files
const validator = SchemaValidator.createFromString(contents);
if (!validator.validate()){
    console.log(`Found error: ${validator.getLastError()}`);
}
```
## Ejemplo avanzado de uso

```ts
import { DOMParser } from '@xmldom/xmldom';
import { SchemaValidator } from "@nodecfdi/xml-schema-validator";

// create SchemaValidator using a Document
const docParse = new DOMParser().parseFromString('example.xml', 'text/xml');
const validator = new SchemaValidator(docParse);

// change schemas collection to override the schema location of a specific namespace
const schemas = validator.buildSchemas();
schemas.create('http://example.org/schemas/x1', './local-schemas/x1.xsd');

// validateWithSchemas does not return boolean, it throws an exception
try{
    validator.validateWithSchemas(schemas);
}catch (e) {
    console.log(`Found error: ${e.message}`);
}

// or validate with boolean
if (!validator.validate(schemas)){
    console.log(`Found error: ${validator.getLastError()}`);
}
```
