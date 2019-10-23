import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

export async function setupProject(
  tree: UnitTestTree,
  schematicRunner: SchematicTestRunner,
  name: string,
) {
  tree = await schematicRunner
    .runExternalSchematicAsync('@schematics/angular', 'workspace', {
      name: 'workspace',
      version: '8.0.0',
      newProjectRoot: '',
    })
    .toPromise();

  tree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      {
        name,
        projectRoot: '',
      },
      tree,
    )
    .toPromise();

  return tree;
}
