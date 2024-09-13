import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import finalHandler from 'finalhandler';
import serveStatic from 'serve-static';

/**
 * Get filename for a given file path URL
 */
export const getFilename = (url: string | URL): string => {
  return fileURLToPath(url);
};

/**
 * Get dirname for a given file path URL
 */
export const getDirname = (url: string | URL): string => {
  return path.dirname(getFilename(url));
};

export const filePath = (file: string, isPublic = false): string =>
  path.join(getDirname(import.meta.url), isPublic ? 'public' : '_files', file);

export const fileContent = (file: string): string => {
  if (!existsSync(file)) {
    return '';
  }

  return readFileSync(file).toString();
};

export const fileContents = (append: string): string => fileContent(filePath(append));

const serve = serveStatic(path.join(getDirname(import.meta.url), 'public'), { index: false });

export const server = http.createServer((request, response) => {
  serve(request, response, finalHandler(request, response));
});
