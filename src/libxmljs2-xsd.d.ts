declare module 'libxmljs2-xsd' {
    interface SchemaXSD {
        validate(source: string): SyntaxError[] | null;

        validateFile(sourcePath: string): SyntaxError[] | null;
    }

    interface ParserOptions {
        recover?: boolean;
        noent?: boolean;
        dtdload?: boolean;
        doctype?: boolean;
        dtdattr?: unknown;
        dtdvalid?: boolean;
        noerror?: boolean;
        errors?: boolean;
        nowarning?: boolean;
        warnings?: boolean;
        pedantic?: boolean;
        noblanks?: boolean;
        blanks?: boolean;
        sax1?: boolean;
        xinclude?: boolean;
        nonet?: boolean;
        net?: boolean;
        nodict?: boolean;
        dict?: boolean;
        nsclean?: boolean;
        implied?: boolean;
        nocdata?: boolean;
        cdata?: boolean;
        noxincnode?: boolean;
        compact?: boolean;
        old?: boolean;
        nobasefix?: boolean;
        basefix?: boolean;
        huge?: boolean;
        oldsax?: boolean;
        ignore_enc?: boolean;
        big_lines?: boolean;
        baseUrl?: string;
    }

    function parse(source: string | Document, options?: ParserOptions): SchemaXSD;

    function parseFile(sourcePath: string, options?: ParserOptions): SchemaXSD;

    export { parse, parseFile, ParserOptions, SchemaXSD };
}
