import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
// import * as path from 'path';

import { Schema } from './schema';

describe('ngx-semantic-version schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'ngx-semantic-version',
    resolve(__dirname, '../collection.json')
  );
  const project = 'foo';
  const defaultOptions: Schema = {
    skipInstall: false,
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = new UnitTestTree(new HostTree());
    appTree = await setupProject(appTree, schematicRunner, project);
  });

  describe('when using the default options', () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync('ng-add', defaultOptions, appTree)
        .toPromise();
    });

    it('should add the commitlint configuration file', () => {
      expect(appTree.files).toContain('/commitlint.config.js');
    });

    it('should add all required dependencies to the package.json', () => {
      const packageJsonPath = '/package.json';
      expect(appTree.files).toContain(packageJsonPath);

      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { devDependencies } = packageJson;
      expect(devDependencies['@commitlint/cli']).toBeDefined();
      expect(devDependencies['@commitlint/config-angular']).toBeDefined();
      expect(devDependencies.commitizen).toBeDefined();
      expect(devDependencies['cz-conventional-changelog']).toBeDefined();
      expect(devDependencies.husky).toBeDefined();
      expect(devDependencies['standard-version']).toBeDefined();
    });

    it('should add a npm run script', () => {
      const packageJsonPath = '/package.json';
      expect(appTree.files).toContain(packageJsonPath);

      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { scripts } = packageJson;
      expect(scripts.release).toEqual('standard-version');
    });

    it('should add the husky configuration', () => {
      const packageJsonPath = '/package.json';
      expect(appTree.files).toContain(packageJsonPath);

      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { husky } = packageJson;
      expect(husky.hooks['commit-msg']).toEqual(
        'commitlint -E HUSKY_GIT_PARAMS'
      );
    });

    it('should add the commitizen configuration', () => {
      const packageJsonPath = '/package.json';
      expect(appTree.files).toContain(packageJsonPath);

      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { config } = packageJson;
      expect(config.commitizen.path).toEqual(
        './node_modules/cz-conventional-changelog'
      );
    });
  });
});

async function setupProject(
  tree: UnitTestTree,
  schematicRunner: SchematicTestRunner,
  name: string
) {
  tree = await schematicRunner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '8.0.0',
      newProjectRoot: '',
    })
    .toPromise();

  tree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name,
        projectRoot: '',
      },
      tree
    )
    .toPromise();

  return tree;
}
