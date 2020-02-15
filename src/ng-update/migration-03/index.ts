import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { getPackageJson, overwritePackageJson } from '../../utils';

export default (_options: any): Rule => {
  return chain([updateDependencies]);
};

const updateDependencies = () => (tree: Tree, context: SchematicContext) => {
  context.logger.info('Updates npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  // be sure that ngx-semantic-version will be removed from the `dependencies` section
  delete packageJson.dependencies['ngx-semantic-version'];

  overwritePackageJson(tree, packageJson);
};
