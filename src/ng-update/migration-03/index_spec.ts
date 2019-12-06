import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migration.json');

const packageJsonAfterMigration = (packgeJsonRawContent: string) => {
  const emptyTree = Tree.empty() as UnitTestTree;
  const runner = new SchematicTestRunner('schematics', collectionPath);
  emptyTree.create(packagePath, packgeJsonRawContent);
  const updatedTree = runner.runSchematic('migration-03', {}, emptyTree);
  return JSON.parse(updatedTree.readContent(packagePath));
};

describe('update to version >= 2', () => {
  it('should update dependencies in package.json', () => {
    const beforeMigration = `{
      "dependencies": {
        "ngx-semantic-version": "1.2.1"
      }
    }`;
    const pkg = packageJsonAfterMigration(beforeMigration);
    const { dependencies } = pkg;
    expect(dependencies['ngx-semantic-version']).toBeUndefined;
  });
});
