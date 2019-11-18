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

import { NgxSemanticVersion as Schema } from './schema';
import { getPackageJson, overwritePackageJson, getMergedPackageJsonConfig } from '../utils';

export default (options: Schema): Rule => {
  return chain([
    addDependencies(options),
    options.packages.includes('commitlint') ? addCommitlintConfigFile(options) : noop(),
    options.packages.includes('husky') ? addHuskyConfig(options) : noop(),
    options.packages.includes('commitizen') ? addCommitizenConfig(options) : noop(),
    options.packages.includes('standard-version') ? addNpmRunScript(options) : noop(),
    options.packages.includes('standard-version') && options.issuePrefix
      ? standardVersionConfig(options)
      : noop(),
    options.skipInstall ? noop() : installDependencies,
  ]);
};

const addDependencies = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  let devDepsToAdd: { [key: string]: string } = {};

  if (options.packages.includes('commitlint')) {
    devDepsToAdd = {
      ...devDepsToAdd,
      '@commitlint/cli': '^8.2.0',
      '@commitlint/config-conventional': '^8.2.0',
    };
  } else {
    context.logger.info('- Skips adding commitlint');
  }

  if (options.packages.includes('commitizen')) {
    devDepsToAdd = {
      ...devDepsToAdd,
      commitizen: '^4.0.3',
      'cz-conventional-changelog': '^3.0.2',
    };
  } else {
    context.logger.info('- Skips adding commitizen');
  }

  if (options.packages.includes('husky')) {
    devDepsToAdd = {
      ...devDepsToAdd,
      husky: '^3.0.9',
    };
  } else {
    context.logger.info('- Skips adding husky');
  }

  if (options.packages.includes('standard-version')) {
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
  context.logger.info('Added husky configuration');

  const packageJson = getPackageJson(tree);

  const configBefore = { ...packageJson.husky };
  const configNew = {
    hooks: {
      'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    },
  };

  packageJson.husky = getMergedPackageJsonConfig(
    configBefore,
    configNew,
    options.overrideConfigurations,
  );
  overwritePackageJson(tree, packageJson);
};

const addCommitizenConfig = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added commitizen configuration');

  const packageJson = getPackageJson(tree);

  const configBefore = { ...packageJson.config };
  const configNew = {
    commitizen: {
      path: './node_modules/cz-conventional-changelog',
    },
  };

  packageJson.config = getMergedPackageJsonConfig(
    configBefore,
    configNew,
    options.overrideConfigurations,
  );

  overwritePackageJson(tree, packageJson);
};

const standardVersionConfig = (options: Schema) => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Added standard-version config');
  const packageJson = getPackageJson(tree);

  const configBefore = { ...packageJson['standard-version'] };
  const configNew = {
    issuePrefixes: [options.issuePrefix || ''],
  };

  packageJson['standard-version'] = getMergedPackageJsonConfig(
    configBefore,
    configNew,
    options.overrideConfigurations,
  );
  overwritePackageJson(tree, packageJson);
};

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
