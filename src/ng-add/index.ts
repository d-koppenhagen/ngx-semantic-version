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
    addDependencies(options),
    addCommitlintConfigFile,
    addDependency(options.husky) ? addHuskyConfig : noop(),
    addDependency(options.commitizen) ? addCommitizenConfig : noop(),
    addDependency(options.standardVersion) ? addNpmRunScript : noop(),
    options.skipInstall ? noop() : installDependencies,
  ]);
};

const addDependency = (configForDependency: boolean | undefined) => {
  return (
    configForDependency === true || typeof configForDependency === 'undefined'
  );
};

const addDependencies = (options: Schema) => (
  tree: Tree,
  context: SchematicContext
) => {
  context.logger.info('Added npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  let devDepsToAdd: { [key: string]: string } = {
    '@commitlint/cli': '^8.2.0',
    '@commitlint/config-conventional': '^8.2.0',
  };

  if (addDependency(options.commitizen)) {
    devDepsToAdd = {
      ...devDepsToAdd,
      commitizen: '^4.0.3',
      'cz-conventional-changelog': '^3.0.2',
    };
  } else {
    context.logger.info('- Skips adding commitizen');
  }

  if (addDependency(options.husky)) {
    devDepsToAdd = {
      ...devDepsToAdd,
      husky: '^3.0.9',
    };
  } else {
    context.logger.info('- Skips adding husky');
  }

  if (addDependency(options.standardVersion)) {
    devDepsToAdd = {
      ...devDepsToAdd,
      'standard-version': '^7.0.0',
    };
  } else {
    context.logger.info('- Skips adding standard-version');
  }

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDepsToAdd,
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
