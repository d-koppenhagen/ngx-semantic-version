import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { getPackageJson, overwritePackageJson } from '../../utils';

export default (_options: any): Rule => {
  return chain([addHuskyConfig, updateDependencies]);
};

const addHuskyConfig = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Removes old husky prepare-commit-msg configuration');

  const packageJson = getPackageJson(tree);
  if (
    packageJson.husky &&
    packageJson.husky.hooks &&
    packageJson.husky.hooks['prepare-commit-msg'] ===
      'exec < /dev/tty && git cz --hook'
  ) {
    delete packageJson.husky.hooks['prepare-commit-msg'];
  }

  overwritePackageJson(tree, packageJson);
};

const updateDependencies = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Updates npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  const devDepsToAdd = {
    husky: '^3.0.9',
  };
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDepsToAdd,
  };

  overwritePackageJson(tree, packageJson);
};
