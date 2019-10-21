import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import { Schema } from './schema';
import { setupProject } from '../test-utils';

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

    it(`should add the 'commitlint' configuration file`, () => {
      expect(appTree.files).toContain('/commitlint.config.js');
    });

    it(`should add all required dependencies to the 'package.json'`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(devDependencies['@commitlint/cli']).toBeDefined();
      expect(devDependencies['@commitlint/config-conventional']).toBeDefined();
      expect(devDependencies.commitizen).toBeDefined();
      expect(devDependencies['cz-conventional-changelog']).toBeDefined();
      expect(devDependencies.husky).toBeDefined();
      expect(devDependencies['standard-version']).toBeDefined();
    });

    it('should add a npm run script', () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { scripts } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(scripts.release).toEqual('standard-version');
    });

    it(`should add the 'husky' configuration`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { husky } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(husky.hooks['commit-msg']).toEqual(
        'commitlint -E HUSKY_GIT_PARAMS'
      );
    });

    it(`should add the 'commitizen' configuration`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { config } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(config.commitizen.path).toEqual(
        './node_modules/cz-conventional-changelog'
      );
    });
  });

  describe(`when disabling 'husky'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          { ...defaultOptions, husky: false },
          appTree
        )
        .toPromise();
    });

    it(`should not add 'husky' to the project`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(devDependencies.husky).not.toBeDefined();
    });

    it(`should skip adding the 'husky' configuration`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { husky } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(husky).not.toBeDefined();
    });
  });

  describe(`when disabling 'commitizen'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          { ...defaultOptions, commitizen: false },
          appTree
        )
        .toPromise();
    });

    it(`should not add 'commitizen' to the project`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(devDependencies.commitizen).not.toBeDefined();
    });

    it(`should skip adding the 'commitizen' configuration`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { config } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(config).not.toBeDefined();
    });
  });

  describe(`when disabling 'standard-version'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          { ...defaultOptions, standardVersion: false },
          appTree
        )
        .toPromise();
    });

    it(`should not add 'standard-version' to the project`, () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(devDependencies['standard-version']).not.toBeDefined();
    });

    it('should skip adding a npm run script', () => {
      const packageJsonPath = '/package.json';
      const packageJson = JSON.parse(getFileContent(appTree, packageJsonPath));
      const { scripts } = packageJson;
      expect(appTree.files).toContain(packageJsonPath);
      expect(scripts.release).not.toBeDefined();
    });
  });
});
