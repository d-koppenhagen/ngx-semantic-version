import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { getPackageJson, overwritePackageJson } from '../../utils';

export default (_options: any): Rule => {
  return chain([removeCommitlintAngularConfig]);
};

const removeCommitlintAngularConfig = () => (
  tree: Tree,
  context: SchematicContext
) => {
  context.logger.info('Updates npm packages as dev dependencies');
  const packageJson = getPackageJson(tree);

  if (packageJson.devDependencies['@commitlint/config-angular'] === '^8.2.0') {
    delete packageJson.devDependencies['@commitlint/config-angular'];
  }

  overwritePackageJson(tree, packageJson);
};
