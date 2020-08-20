import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { getPackageJson, overwritePackageJson } from '../../utils';
import { NgxSemanticVersion as Schema, PackageName } from '../../ng-add/schema';
import { PackageJsonConfigPart } from '../../utils';
import { DEV_DEPS_TO_ADD } from '../../ng-add/defaults';

export default (_options: Schema): Rule => {
  return chain([updateDependencies]);
};

const updateDependencies = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Updating npm packages dev dependencies for tooling');
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
    devDepsToAdd = {
      ...devDepsToAdd,
      ...value[searchKey],
    };
  }

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDepsToAdd,
  };

  overwritePackageJson(tree, packageJson);
};
