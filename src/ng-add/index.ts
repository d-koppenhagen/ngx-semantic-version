import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  template,
  url,
  noop,
  FileEntry,
  forEach,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { NgxSemanticVersion as Schema, PackageName } from './schema';
import {
  getPackageJson,
  overwritePackageJson,
  getMergedPackageJsonConfig,
  PackageJsonConfigPart,
} from '../utils';
import {
  DEV_DEPS_TO_ADD,
  HUSKY_DEFAULTS,
  COMMITIZEN_DEFAULTS,
  STANDARD_VERSION_DEFAULTS,
} from './defaults';

export default (options: Schema): Rule => {
  return chain([
    addDependencies(options),
    options.packages.includes('commitlint') ? addCommitlintConfigFile(options) : noop(),
    options.packages.includes('husky') ? addHuskyConfig(options) : noop(),
    options.packages.includes('commitizen') ? addCommitizenConfig(options) : noop(),
    options.packages.includes('standard-version') ? addNpmRunScript(options) : noop(),
    options.packages.includes('standard-version') ? standardVersionConfig(options) : noop(),
    options.skipInstall ? noop() : installDependencies,
  ]);
};

const addDependencies = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  let devDepsToAdd: PackageJsonConfigPart<string> = {};

  const map = new Map([
    ['commitlint', DEV_DEPS_TO_ADD],
    ['commitizen', DEV_DEPS_TO_ADD],
    ['husky', DEV_DEPS_TO_ADD],
    ['standard-version', DEV_DEPS_TO_ADD],
  ]);

  for (const [key, value] of map.entries()) {
    const searchKey = key as PackageName;
    if (options.packages.includes(searchKey)) {
      devDepsToAdd = {
        ...devDepsToAdd,
        ...value[searchKey],
      };
    } else {
      context.logger.info(`- Skips adding ${searchKey}`);
    }
  }

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDepsToAdd,
  };

  overwritePackageJson(tree, packageJson);
};

const addNpmRunScript = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added npm script for release');
  const packageJson = getPackageJson(tree);

  const configBefore = { ...packageJson.scripts };
  const configNew = { release: 'standard-version' };

  packageJson.scripts = getMergedPackageJsonConfig(
    configBefore,
    configNew,
    options.overrideConfigurations,
  );
  overwritePackageJson(tree, packageJson);
};

const addHuskyConfig = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  addConfig(tree, context, options, 'husky', 'husky', HUSKY_DEFAULTS);
};

const addCommitizenConfig = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  addConfig(tree, context, options, 'commitizen', 'config', COMMITIZEN_DEFAULTS);
};

const standardVersionConfig = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  if (!options.issuePrefix && !options.standardVersionConfig) return noop();
  const defaults = {
    ...STANDARD_VERSION_DEFAULTS,
    issuePrefixes: [options.issuePrefix || '#'],
  };
  addConfig(tree, context, options, 'standard-version', 'standard-version', defaults);
};

function addConfig(
  tree: Tree,
  context: SchematicContext,
  options: Schema,
  what: string,
  getPackageJsonPart: 'husky' | 'config' | 'standard-version',
  defaults: object,
) {
  context.logger.info('Added ' + what + ' configuration');
  const packageJson = getPackageJson(tree);
  const configBefore = { ...packageJson[getPackageJsonPart] };
  packageJson[getPackageJsonPart] = getMergedPackageJsonConfig(
    configBefore,
    defaults,
    options.overrideConfigurations,
  );
  overwritePackageJson(tree, packageJson);
}

const addCommitlintConfigFile = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added commitlint configuration file');
  const sourceTemplates = url('./files');
  const sourceParameterizedTemplates = apply(sourceTemplates, [
    template({
      issuePrefix: options.issuePrefix || '',
    }),
    forEach((fileEntry: FileEntry) => {
      // override existing files if force flag has been set
      if (options.overrideConfigurations && tree.exists(fileEntry.path)) {
        tree.overwrite(fileEntry.path, fileEntry.content);
        return null;
      }
      return fileEntry;
    }),
  ]);
  return mergeWith(sourceParameterizedTemplates)(tree, context);
};

const installDependencies = () => (_tree: Tree, context: SchematicContext) => {
  context.logger.info('Installs npm dependencies');
  context.addTask(new NodePackageInstallTask());
};
