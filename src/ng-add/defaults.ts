export const DEV_DEPS_TO_ADD = {
  commitlint: {
    '@commitlint/cli': '^8.3.5',
    '@commitlint/config-conventional': '^8.3.4',
  },
  commitizen: {
    commitizen: '^4.0.3',
    'cz-conventional-changelog': '^3.1.0',
  },
  husky: {
    husky: '^4.2.1',
  },
  'standard-version': {
    'standard-version': '^7.1.0',
  },
};

export const HUSKY_DEFAULTS = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};

export const COMMITIZEN_DEFAULTS = {
  commitizen: {
    path: './node_modules/cz-conventional-changelog',
  },
};

export const STANDARD_VERSION_DEFAULTS = {
  types: [
    {
      type: 'feat',
      section: 'Features',
    },
    {
      type: 'fix',
      section: 'Bug Fixes',
    },
    {
      type: 'chore',
      hidden: true,
    },
    {
      type: 'ci',
      hidden: true,
    },
    {
      type: 'build',
      hidden: true,
    },
    {
      type: 'docs',
      hidden: true,
    },
    {
      type: 'style',
      hidden: true,
    },
    {
      type: 'refactor',
      hidden: true,
    },
    {
      type: 'perf',
      hidden: true,
    },
    {
      type: 'test',
      hidden: true,
    },
  ],
  header: 'Changelog',
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
  userUrlFormat: '{{host}}/{{user}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  issuePrefixes: ['#'],
};
