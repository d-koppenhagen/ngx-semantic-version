/**
 * ngx-semantic-version Schema
 * configure commitlint, husky, commitizen and standard-version configuration
 */
export interface NgxSemanticVersion {
    /**
     * select the packages that should to be installed and configured
     */
    packages: PackageName[];
    /**
     * Skip installing the npm packages
     */
    skipInstall?: boolean;
    /**
     * add the standard-version default configuration to the `packages.json` file
     */
    standardVersionConfig?: boolean;
    /**
     * configure an issue prefix that should be checked by each commit
     */
    issuePrefix?: string;
    /**
     * Override existing configuration parameters
     */
    overrideConfigurations?: boolean;
}

export type PackageName = "commitlint" | "commitizen" | "husky" | "standard-version";
