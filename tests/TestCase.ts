import { existsSync, readFileSync } from 'fs';

export class TestCase {
    public static filePath(filename: string): string {
        return `${__dirname}/assets/${filename}`;
    }

    public static filePublicPath(filename: string): string {
        return `${__dirname}/public/${filename}`;
    }

    public static fileContents(filename: string): string {
        if (!existsSync(TestCase.filePath(filename))) {
            return '';
        }
        return readFileSync(TestCase.filePath(filename), 'binary');
    }
}
