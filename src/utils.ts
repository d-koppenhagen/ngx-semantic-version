import { join } from 'path';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

const PACKAGE_JSON = 'package.json';

export interface PackageJson {
  dependencies: object;
  devDependencies: object;
  name?: string;
  version?: string;
  license?: string;
  scripts?: object;
  config?: object;
  husky?: object;
}

class FileNotFoundException extends Error {
  constructor(fileName: string) {
    const message = `File ${fileName} not found!`;
    super(message);
  }
}

export const getJsonFile = <T>(tree: Tree, path: string): T => {
  const file = tree.get(path);
  if (!file) {
    throw new FileNotFoundException(path);
  }

  try {
    const content = JSON.parse(file.content.toString());

    return content as T;
  } catch (e) {
    throw new SchematicsException(`File ${path} could not be parsed!`);
  }
};

export const getFileContents = (tree: Tree, filePath: string): string => {
  const buffer = tree.read(filePath) || '';

  return buffer.toString();
};

export const getPackageJson = (
  tree: Tree,
  workingDirectory: string = ''
): PackageJson => {
  const url = join(workingDirectory, PACKAGE_JSON);

  return getJsonFile(tree, url);
};

export const overwritePackageJson = (
  tree: Tree,
  content: PackageJson,
  workingDirectory: string = ''
) => {
  const url = join(workingDirectory, PACKAGE_JSON);

  tree.overwrite(url, JSON.stringify(content, null, 2));
};
