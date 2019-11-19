import { resolve } from 'path';
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import { NgxSemanticVersion as Schema } from './schema';
import { setupProject } from '../test-utils';
import { STANDARD_VERSION_DEFAULTS } from './defaults';

const PACKAGE_JSON_PATH = '/package.json';
const COMMITLINT_PATH = '/commitlint.config.js';

describe('ngx-semantic-version schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'ngx-semantic-version',
    resolve(__dirname, '../collection.json'),
  );
  const project = 'foo';
  const defaultOptions: Schema = {
    skipInstall: false,
    packages: ['commitlint', 'commitizen', 'husky', 'standard-version'],
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
      expect(appTree.files).toContain(COMMITLINT_PATH);
      const fileContent = getFileContent(appTree, COMMITLINT_PATH);
      expect(fileContent).not.toMatch(/rules: {\s+\'references-empty\': \[2, \'never\'\].\s+\},/g);
      expect(fileContent).not.toMatch(
        /parserPreset: {\s+parserOpts: \{\s+issuePrefixes: \[\'\PREFIX-\'\],\s+},\s+},/g,
      );
    });

    it(`should add all required dependencies to the 'package.json'`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies['@commitlint/cli']).toBeDefined();
      expect(devDependencies['@commitlint/config-conventional']).toBeDefined();
      expect(devDependencies.commitizen).toBeDefined();
      expect(devDependencies['cz-conventional-changelog']).toBeDefined();
      expect(devDependencies.husky).toBeDefined();
      expect(devDependencies['standard-version']).toBeDefined();
    });

    it('should add a npm run script', () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { scripts } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(scripts.release).toEqual('standard-version');
    });

    it(`should add the 'husky' configuration`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { husky } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(husky.hooks['commit-msg']).toEqual('commitlint -E HUSKY_GIT_PARAMS');
    });

    it(`should add the 'commitizen' configuration`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { config } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(config.commitizen.path).toEqual('./node_modules/cz-conventional-changelog');
    });
  });

  describe(`when not using 'husky'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            packages: ['commitlint', 'commitizen', 'standard-version'],
          },
          appTree,
        )
        .toPromise();
    });

    it(`should not add 'husky' to the project`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies.husky).not.toBeDefined();
    });

    it(`should skip adding the 'husky' configuration`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { husky } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(husky).not.toBeDefined();
    });
  });

  describe(`when disabling 'commitlint'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            packages: ['commitizen', 'husky', 'standard-version'],
          },
          appTree,
        )
        .toPromise();
    });

    it(`should not add 'commitlint' to the project`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies['@commitlint/cli']).not.toBeDefined();
      expect(devDependencies['@commitlint/config-conventional']).not.toBeDefined();
    });
  });

  describe(`when disabling 'commitizen'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            packages: ['commitlint', 'husky', 'standard-version'],
          },
          appTree,
        )
        .toPromise();
    });

    it(`should not add 'commitizen' to the project`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies.commitizen).not.toBeDefined();
    });

    it(`should skip adding the 'commitizen' configuration`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { config } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(config).not.toBeDefined();
    });
  });

  describe(`when disabling 'standard-version'`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            ...defaultOptions,
            packages: ['commitlint', 'commitizen', 'husky'],
          },
          appTree,
        )
        .toPromise();
    });

    it(`should not add 'standard-version' to the project`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { devDependencies } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(devDependencies['standard-version']).not.toBeDefined();
    });

    it('should skip adding a npm run script', () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const { scripts } = packageJson;
      expect(appTree.files).toContain(PACKAGE_JSON_PATH);
      expect(scripts.release).not.toBeDefined();
    });
  });

  describe(`when using an issue prefix`, () => {
    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync('ng-add', { ...defaultOptions, issuePrefix: 'PREFIX-' }, appTree)
        .toPromise();
    });

    it(`should configure 'issuePrefixes' in '/commitlint.config.js'`, () => {
      expect(appTree.files).toContain(COMMITLINT_PATH);
      const fileContent = getFileContent(appTree, COMMITLINT_PATH);
      expect(fileContent).toMatch(/rules: {\s+\'references-empty\': \[2, \'never\'\].\s+\},/g);
      expect(fileContent).toMatch(
        /parserPreset: {\s+parserOpts: \{\s+issuePrefixes: \[\'\PREFIX-\'\],\s+},\s+},/g,
      );
    });

    it(`should add 'standard-version' config`, () => {
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      expect(packageJson['standard-version'].issuePrefixes).toContain('PREFIX-');
    });
  });

  describe(`when using '--standardVersionConfig'`, () => {
    it(`should add the basic configuration to '/package.json'`, async () => {
      appTree = await schematicRunner
        .runSchematicAsync('ng-add', { ...defaultOptions, standardVersionConfig: true }, appTree)
        .toPromise();
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      expect(packageJson['standard-version']).toEqual(STANDARD_VERSION_DEFAULTS);
    });

    it(`should add the basic configuration with 'issuePrefix' to '/package.json'`, async () => {
      appTree = await schematicRunner
        .runSchematicAsync(
          'ng-add',
          { ...defaultOptions, standardVersionConfig: true, issuePrefix: 'PREFIX-' },
          appTree,
        )
        .toPromise();
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      const expectedConfig = {
        ...STANDARD_VERSION_DEFAULTS,
        issuePrefixes: ['PREFIX-'],
      };
      expect(packageJson['standard-version']).toEqual(expectedConfig);
    });
  });

  describe(`when running in an existing project`, () => {
    let appTreeOnExistingProject: UnitTestTree;
    let packageJson: { [key: string]: any };
    let packageJsonModified: { [key: string]: any };

    beforeEach(async () => {
      appTree = await schematicRunner
        .runSchematicAsync('ng-add', defaultOptions, appTree)
        .toPromise();
      const packageJson = JSON.parse(getFileContent(appTree, PACKAGE_JSON_PATH));
      packageJsonModified = {
        ...packageJson,
        scripts: {
          release: 'foo ./bar',
          foo: 'bar',
        },
        husky: {
          hooks: {
            'commit-msg': 'foo-bar',
          },
        },
        config: {
          commitizen: {
            path: '~/foo-bar',
          },
          other: {
            foo: 'bar',
          },
        },
        'standard-version': {
          issuePrefixes: 'foo',
          skip: {
            changelog: true,
          },
        },
      };
    });

    describe(`and not using '--overrideConfigurations'`, () => {
      beforeEach(async () => {
        appTree.overwrite(PACKAGE_JSON_PATH, JSON.stringify(packageJsonModified));
        appTree.delete(COMMITLINT_PATH);
        appTreeOnExistingProject = new UnitTestTree(appTree);
        appTreeOnExistingProject = await schematicRunner
          .runSchematicAsync(
            'ng-add',
            { ...defaultOptions, issuePrefix: 'bar' },
            appTreeOnExistingProject,
          )
          .toPromise();
        packageJson = JSON.parse(getFileContent(appTreeOnExistingProject, PACKAGE_JSON_PATH));
      });

      it(`should not override 'standard-version' config`, () => {
        expect(packageJson['standard-version'].issuePrefixes).toContain('foo');
      });

      it(`should not override 'scripts' config`, () => {
        expect(packageJson.scripts.release).toContain('foo ./bar');
      });

      it(`should not override 'commitizen' config`, () => {
        expect(packageJson.config.commitizen.path).toContain('~/foo-bar');
      });

      it(`should not override 'husky' config`, () => {
        expect(packageJson.husky.hooks['commit-msg']).toContain('foo-bar');
      });
    });

    describe(`and using '--overrideConfigurations'`, () => {
      beforeEach(async () => {
        appTree.overwrite(PACKAGE_JSON_PATH, JSON.stringify(packageJsonModified));
        appTree.overwrite(COMMITLINT_PATH, '// fooBar');
        appTreeOnExistingProject = new UnitTestTree(appTree);
        appTreeOnExistingProject = await schematicRunner
          .runSchematicAsync(
            'ng-add',
            { ...defaultOptions, overrideConfigurations: true, issuePrefix: 'bar' },
            appTreeOnExistingProject,
          )
          .toPromise();
        packageJson = JSON.parse(getFileContent(appTreeOnExistingProject, PACKAGE_JSON_PATH));
      });

      it(`should override 'standard-version' config`, () => {
        expect(packageJson['standard-version'].issuePrefixes).toContain('bar');
        expect(packageJson['standard-version'].skip.changelog).toBeTruthy;
      });

      it(`should override 'scripts' config`, () => {
        expect(packageJson.scripts.release).toContain('standard-version');
        expect(packageJson.scripts.foo).toContain('bar');
      });

      it(`should override 'commitizen' config`, () => {
        expect(packageJson.config.commitizen.path).toContain(
          './node_modules/cz-conventional-changelog',
        );
        expect(packageJson.config.other.foo).toContain('bar');
      });

      it(`should override 'husky' config`, () => {
        expect(packageJson.husky.hooks['commit-msg']).toContain('commitlint -E HUSKY_GIT_PARAMS');
      });

      it(`should override an existing 'commitlint' configuration file`, () => {
        expect(appTree.files).toContain(COMMITLINT_PATH);
        const fileContent = getFileContent(appTree, COMMITLINT_PATH);
        expect(fileContent).toMatch(/module.exports = \{(.*)\};/gs);
      });
    });
  });
});
