import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  apply,
  url,
  mergeWith,
  template,
  MergeStrategy,
} from '@angular-devkit/schematics';
import { getPackageJson, overwritePackageJson } from '../../utils';

export default (_options: any): Rule => {
  return chain([removeCommitlintAngularConfig, overrideCommitlintConfigFile]);
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
  packageJson.devDependencies['@commitlint/config-conventional'] = '^8.2.0';

  overwritePackageJson(tree, packageJson);
};

const overrideCommitlintConfigFile = () => (
  tree: Tree,
  context: SchematicContext
) => {
  context.logger.info('Added commitlint configuration file');
  const sourceTemplates = url('./files/commitlint.config.js');
  const sourceParameterizedTemplates = apply(sourceTemplates, [template({})]);
  return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite)(
    tree,
    context
  );
};
