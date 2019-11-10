export interface Schema {
  /**
   * select the packages that should to be installed and configured
   */
  packages: Package[];
  /**
   * Skip installing the npm packages
   */
  skipInstall?: boolean;
  /**
   * configure an issue prefix that should be checked by each commit
   */
  issuePrefix?: string;
  /**
   * force to override existing configuration params and files
   */
  force?: boolean;
}

export type Package = 'commitlint' | 'commitizen' | 'husky' | 'standard-version'
