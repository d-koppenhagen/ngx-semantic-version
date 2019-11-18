/**
 * ngx-semantic-version Schema
 * configure commitlint, husky, commitizen and standard-version configuration
 */
export interface NgxSemanticVersion {
    /**
     * select the packages that should to be installed and configured
     */
    packages: ("commitlint" | "commitizen" | "husky" | "standard-version")[];
    /**
     * Skip installing the npm packages
     */
    skipInstall?: boolean;
    /**
     * configure an issue prefix that should be checked by each commit
     */
    issuePrefix?: string;
    /**
     * Override existing configuration parameters
     */
    overrideConfigurations?: boolean;
}
