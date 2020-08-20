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
  return runner.runSchematicAsync('migration-04', {}, emptyTree)
    .pipe(
      map(updatedTree => JSON.parse(updatedTree.readContent(packagePath)))
    );
};

describe('update to version >= 2', () => {
  it('should not remove modified @commitlint/config-angular version from package.json', () => {
    const beforeMigration = `{
      "devDependencies": {
        "@commitlint/cli": "0.0.0",
        "@commitlint/config-conventional": "0.0.0",
        "commitizen": "0.0.0",
        "cz-conventional-changelog": "0.0.0",
        "husky": "0.0.0",
        "standard-version": "0.0.0"
      }
    }`;
    packageJsonAfterMigration(beforeMigration).subscribe((pkg) => {;
      const { devDependencies } = pkg;
      expect(devDependencies['@commitlint/cli']).toEqual('^9.1.2');
      expect(devDependencies['@commitlint/config-conventional']).toEqual('^9.1.2');
      expect(devDependencies['commitizen']).toEqual('^4.1.2');
      expect(devDependencies['cz-conventional-changelog']).toEqual('^3.2.0');
      expect(devDependencies['husky']).toEqual('^4.2.5');
      expect(devDependencies['standard-version']).toEqual('^9.0.0');
    });
  });
});
