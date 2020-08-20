import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../../migration.json');

const packageJsonAfterMigration = (packgeJsonRawContent: string): Observable<any> => {
  const emptyTree = Tree.empty() as UnitTestTree;
  const runner = new SchematicTestRunner('schematics', collectionPath);
  emptyTree.create(packagePath, packgeJsonRawContent);
  return runner.runSchematicAsync('migration-03', {}, emptyTree)
    .pipe(
      map(updatedTree => JSON.parse(updatedTree.readContent(packagePath)))
    );
};

describe('update to version >= 2', () => {
  it('should update dependencies in package.json', () => {
    const beforeMigration = `{
      "dependencies": {
        "ngx-semantic-version": "1.2.1"
      }
    }`;
    packageJsonAfterMigration(beforeMigration).subscribe((pkg) => {
      const { dependencies } = pkg;
      expect(dependencies['ngx-semantic-version']).toBeUndefined;
    });
  });
});
