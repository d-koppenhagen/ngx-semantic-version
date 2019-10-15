import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migration.json');

const packageJsonAfterMigration = (packgeJsonRawContent: string) => {
  const emptyTree = Tree.empty() as UnitTestTree;
  const runner = new SchematicTestRunner('schematics', collectionPath);
  emptyTree.create(packagePath, packgeJsonRawContent);
  const updatedTree = runner.runSchematic('migration-02', {}, emptyTree);
  return JSON.parse(updatedTree.readContent(packagePath));
};

describe('update to version 0.0.5', () => {
  it('should remove @commitlint/config-angular@^8.2.0 from package.json', () => {
    const beforeMigration = `{
      "devDependencies": {
        "@commitlint/config-angular": "^8.2.0"
      }
    }`;
    const pkg = packageJsonAfterMigration(beforeMigration);
    const { devDependencies } = pkg;
    expect(devDependencies['@commitlint/config-angular']).not.toBeDefined();
    expect(devDependencies['@commitlint/config-conventional']).toEqual(
      '^8.2.0'
    );
  });

  it('should not remove modified @commitlint/config-angular version from package.json', () => {
    const beforeMigration = `{
      "devDependencies": {
        "@commitlint/config-angular": "^8.0.0"
      }
    }`;
    const pkg = packageJsonAfterMigration(beforeMigration);
    const { devDependencies } = pkg;
    expect(devDependencies['@commitlint/config-angular']).toEqual('^8.0.0');
  });
});
