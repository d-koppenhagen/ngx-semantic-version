import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migration.json');

const huskykHookForTest = (hook: string, command: string) => {
  return `{
    "husky": {
      "hooks": {
        "${hook}": "${command}"
      }
    }
  }`;
};
const packageJsonAfterMigration = (packgeJsonRawContent: string) => {
  const emptyTree = Tree.empty() as UnitTestTree;
  const runner = new SchematicTestRunner('schematics', collectionPath);
  emptyTree.create(packagePath, packgeJsonRawContent);
  const updatedTree = runner.runSchematic('migration-01', {}, emptyTree);
  return JSON.parse(updatedTree.readContent(packagePath));
};

describe('update from version 0.0.4', () => {
  const prepareCommitMsgHookToBeRemoved = 'exec < /dev/tty && git cz --hook';

  it(`should remove a previous configuration`, () => {
    const beforeMigration = huskykHookForTest(
      'prepare-commit-msg',
      prepareCommitMsgHookToBeRemoved
    );
    const pkg = packageJsonAfterMigration(beforeMigration);
    expect(pkg.husky.hooks['prepare-commit-msg']).not.toBeDefined();
  });
  it(`should not touch if the husky hook has been modified`, () => {
    const beforeMigration = huskykHookForTest(
      'prepare-commit-msg',
      'some other user defined hook'
    );
    const pkg = packageJsonAfterMigration(beforeMigration);
    expect(pkg.husky.hooks['prepare-commit-msg']).toBeDefined();
    expect(pkg.husky.hooks['prepare-commit-msg']).not.toEqual(
      prepareCommitMsgHookToBeRemoved
    );
  });
  it('should update dependencies in package.json', () => {
    const beforeMigration = `{
      "devDependencies": {
        "husky": "^3.0.8"
      }
    }`;
    const pkg = packageJsonAfterMigration(beforeMigration);
    const { devDependencies } = pkg;
    expect(devDependencies.husky).toEqual('^3.0.9');
  });
});
