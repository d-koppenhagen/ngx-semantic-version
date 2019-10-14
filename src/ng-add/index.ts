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
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { Schema } from './schema';
import { getPackageJson, overwritePackageJson } from '../utils';

export default (options: Schema): Rule => {
  return chain([
    addDependencies,
    addCommitlintConfigFile,
    addHuskyConfig,
    addCommitizenConfig,
    addNpmRunScript,
    options.skipInstall ? noop() : installDependencies,
  ]);
};

const addDependencies = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  const devDepsToAdd = {
    '@commitlint/cli': '^8.2.0',
    '@commitlint/config-angular': '^8.2.0',
    commitizen: '^4.0.3',
    'cz-conventional-changelog': '^3.0.2',
    husky: '^3.0.8',
    'standard-version': '^7.0.0',
  };
  packageJson.devDependencies = {
    ...devDepsToAdd,
    ...packageJson.devDependencies,
  };

  overwritePackageJson(tree, packageJson);
};

const addNpmRunScript = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added npm script for release');
  const packageJson = getPackageJson(tree);

  const scriptsToAdd = {
    release: 'standard-version',
  };
  packageJson.scripts = { ...scriptsToAdd, ...packageJson.scripts };

  overwritePackageJson(tree, packageJson);
};

const addHuskyConfig = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added husky configuration');

  const packageJson = getPackageJson(tree);

  const huskyConfig = {
    hooks: {
      'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    },
  };
  packageJson.husky = { ...huskyConfig, ...packageJson.husky };

  overwritePackageJson(tree, packageJson);
};

const addCommitizenConfig = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added commitizen configuration');

  const packageJson = getPackageJson(tree);

  const commitizenConfig = {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  };
  packageJson.config = { ...commitizenConfig, ...packageJson.config };

  overwritePackageJson(tree, packageJson);
};

const addCommitlintConfigFile = () => (
  tree: Tree,
  context: SchematicContext
) => {
  context.logger.info('Added commitlint configuration file');
  const sourceTemplates = url('./files');
  const sourceParameterizedTemplates = apply(sourceTemplates, [template({})]);
  return mergeWith(sourceParameterizedTemplates)(tree, context);
};

const installDependencies = () => (_tree: Tree, context: SchematicContext) => {
  context.logger.info('Installs npm dependencies');
  context.addTask(new NodePackageInstallTask());
};
