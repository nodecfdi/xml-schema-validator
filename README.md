# `@nodecfdi/xml-schema-validator`

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Discord][badge-discord]][discord]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Reliability][badge-reliability]][reliability]
[![Maintainability][badge-maintainability]][maintainability]
[![Code Coverage][badge-coverage]][coverage]
[![Violations][badge-violations]][violations]
[![Total Downloads][badge-downloads]][downloads]

> Library for XML Schema Validations

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de `@nodecfdi/xml-schema-validator`

Esta es una librería para validar archivos XML a través de multiples Esquemas XSD acorde a sus definiciones.

1. Recibe un string xml válido con el contenido a ser evaluado.
2. Escanear el archivo por cada schemaLocation.
3. Generar un esquema que incluya todos los esquemas.
4. Validar el xml nuevamente con el esquema generado.

Librería inspirada por la versión para php https://github.com/eclipxe13/XmlSchemaValidator

## Advertencia

Actualmente solo está soportada la carga de esquema local, no funciona con esquemas remotos, debido a incompatibilidad
con la lib actual.

## Documentación

La documentación está disponible en el sitio web [NodeCfdi](https://nodecfdi.com/librarys/xml-schema-validator/getting-started/)

## Soporte

Puedes obtener soporte abriendo un ticket en Github.

Adicionalmente, esta librería pertenece a la comunidad [OcelotlStudio](https://ocelotlstudio.com), así que puedes usar los mismos canales de comunicación para obtener ayuda de algún miembro de la comunidad.

## Compatibilidad

Esta librería se mantendrá compatible con al menos la versión con
[soporte activo de Node](https://nodejs.org/es/about/releases/) más reciente.

También utilizamos [Versionado Semántico 2.0.0](https://semver.org/lang/es/) por lo que puedes usar esta librería sin temor a romper tu aplicación.

## Contribuciones

Las contribuciones con bienvenidas. Por favor lee [CONTRIBUTING][] para más detalles y recuerda revisar el archivo [CHANGELOG][].

## Copyright and License

The `@nodecfdi/xml-schema-validator` library is copyright © [NodeCfdi](https://github.com/nodecfdi) - [OcelotlStudio](https://ocelotlstudio.com) and licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/nodecfdi/.github/blob/main/docs/CONTRIBUTING.md
[changelog]: https://github.com/nodecfdi/xml-schema-validator/blob/main/CHANGELOG.md
[source]: https://github.com/nodecfdi/xml-schema-validator
[node-version]: https://www.npmjs.com/package/@nodecfdi/xml-schema-validator
[discord]: https://discord.gg/AsqX8fkW2k
[release]: https://www.npmjs.com/package/@nodecfdi/xml-schema-validator
[license]: https://github.com/nodecfdi/xml-schema-validator/blob/main/LICENSE.md
[build]: https://github.com/nodecfdi/xml-schema-validator/actions/workflows/build.yml?query=branch:main
[reliability]: https://sonarcloud.io/component_measures?id=nodecfdi_xml-schema-validator&metric=Reliability
[maintainability]: https://sonarcloud.io/component_measures?id=nodecfdi_xml-schema-validator&metric=Maintainability
[coverage]: https://sonarcloud.io/component_measures?id=nodecfdi_xml-schema-validator&metric=Coverage
[violations]: https://sonarcloud.io/project/issues?id=nodecfdi_xml-schema-validator&resolved=false
[downloads]: https://www.npmjs.com/package/@nodecfdi/xml-schema-validator
[badge-source]: https://img.shields.io/badge/source-nodecfdi/xml--schema--validator-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@nodecfdi/xml-schema-validator.svg?logo=nodedotjs
[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord
[badge-release]: https://img.shields.io/npm/v/@nodecfdi/xml-schema-validator.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/nodecfdi/xml-schema-validator.svg?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/actions/workflow/status/nodecfdi/xml-schema-validator/build.yml?branch=main&logo=github-actions
[badge-reliability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_xml-schema-validator&metric=reliability_rating
[badge-maintainability]: https://sonarcloud.io/api/project_badges/measure?project=nodecfdi_xml-schema-validator&metric=sqale_rating
[badge-coverage]: https://img.shields.io/sonar/coverage/nodecfdi_xml-schema-validator/main?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-violations]: https://img.shields.io/sonar/violations/nodecfdi_xml-schema-validator/main?format=long&logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io
[badge-downloads]: https://img.shields.io/npm/dm/@nodecfdi/xml-schema-validator.svg?logo=npm
