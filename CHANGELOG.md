# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0-beta.5](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2020-02-11)


### Features

* update default versions ([27c77c5](https://github.com/d-koppenhagen/ngx-semantic-version/commit/27c77c5d0b76ac86cdf8a3c77b1334f522ccf50c))

## [2.0.0-beta.4](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2020-01-06)

## [2.0.0-beta.3](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2019-12-11)


### Features

* warning when missing 'repository' or 'bugs' fields ([25815db](https://github.com/d-koppenhagen/ngx-semantic-version/commit/25815dbfe94834fe9eb754905b8edf6e5fd8e88e)), closes [#20](https://github.com/d-koppenhagen/ngx-semantic-version/issues/20)

## [2.0.0-beta.2](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2019-12-09)


### Bug Fixes

* handle `standardVersionConfig` flag correctly ([6bb17ee](https://github.com/d-koppenhagen/ngx-semantic-version/commit/6bb17eef02313d922f3ad0201bf9c63d0141a2cd))

## [2.0.0-beta.1](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2019-12-06)


### Features

* add package to devDependencies ([f129bb2](https://github.com/d-koppenhagen/ngx-semantic-version/commit/f129bb2712d7a6a41138b32c3440a81c13a6e15b)), closes [#18](https://github.com/d-koppenhagen/ngx-semantic-version/issues/18)

## [2.0.0-beta.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-alpha.1...v2.0.0-beta.0) (2019-11-21)

## [2.0.0-alpha.1](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2019-11-18)


### ⚠ BREAKING CHANGES

* `--force` will override existing files if there is a conflict. `--overrideConfigurations` can be used now to override conflicts within existing configuration parameters

### Features

* introduce `--standardVersionConfig` param ([94e84c5](https://github.com/d-koppenhagen/ngx-semantic-version/commit/94e84c5b44cac887af6021508fb9ea2f8b4cb75e))
* introduce `overrideConfigurations` param ([f91f92e](https://github.com/d-koppenhagen/ngx-semantic-version/commit/f91f92eebffdfe2683c5ac6378f93810261b6d53))

## [2.0.0-alpha.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v1.2.1...v2.0.0-alpha.0) (2019-11-15)


### ⚠ BREAKING CHANGES

* `--husky=<false|true>`, `--commitizen=<false|true>`, `--standardVersion=<false|true>` are not supported anymore| use `--packages=commitizen,husky,commitlint,standard-version` instead.
By default all packaged will be added.

### Features

* provide packages from x-promt ([3390ff0](https://github.com/d-koppenhagen/ngx-semantic-version/commit/3390ff04d803fd8829c530c0a86c2cb0f528dcb3)), closes [#11](https://github.com/d-koppenhagen/ngx-semantic-version/issues/11)

### [1.2.1](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v1.2.0...v1.2.1) (2019-11-06)


### Bug Fixes

* add missing schema validation ([6554157](https://github.com/d-koppenhagen/ngx-semantic-version/commit/65541576ff55e1c857a074811fe2cefd84bd5de9))

## [1.2.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v1.1.1...v1.2.0) (2019-11-02)


### Features

* adds `--force` param ([60f4910](https://github.com/d-koppenhagen/ngx-semantic-version/commit/60f4910d3579453c3cb581fe6362f3f57184e8d3)), closes [#12](https://github.com/d-koppenhagen/ngx-semantic-version/issues/12)

### [1.1.1](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v1.1.0...v1.1.1) (2019-10-28)

## [1.1.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v1.0.0...v1.1.0) (2019-10-28)


### Features

* **noisafno:** sfdafda ([093347a](https://github.com/d-koppenhagen/ngx-semantic-version/commit/093347a96141f03c8638a42d62e2fa42bd34c273))
* allow to specify an issue prefix ([fa1625f](https://github.com/d-koppenhagen/ngx-semantic-version/commit/fa1625fb8245edec79bf1c4eb7ffe861cf19a7b1)), closes [#10](https://github.com/d-koppenhagen/ngx-semantic-version/issues/10)


### Bug Fixes

* **saf:** asf ([1ae998d](https://github.com/d-koppenhagen/ngx-semantic-version/commit/1ae998daffba0a20c8503bfc3fb4c3056db45d41))

## [1.0.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.1.4...v1.0.0) (2019-10-21)

### [0.1.4](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.1.3...v0.1.4) (2019-10-21)

### [0.1.3](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.1.2...v0.1.3) (2019-10-21)


### Features

* adds options to skip adding packages ([fc01543](https://github.com/d-koppenhagen/ngx-semantic-version/commit/fc01543f38548c79b2e99c8395f52446d9379004)), closes [#9](https://github.com/d-koppenhagen/ngx-semantic-version/issues/9)

### [0.1.2](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.1.1...v0.1.2) (2019-10-15)


### Bug Fixes

* fixes migration ([9c18b44](https://github.com/d-koppenhagen/ngx-semantic-version/commit/9c18b441c653bd31593fbce5af7e39806e825698))

### [0.1.1](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.1.0...v0.1.1) (2019-10-15)


### Bug Fixes

* **ng-update:** use migration-02 within correct version ([4f971b7](https://github.com/d-koppenhagen/ngx-semantic-version/commit/4f971b78da89b67ef37fdc76aef604891b19c248))

## [0.1.0](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.0.4...v0.1.0) (2019-10-15)


### ⚠ BREAKING CHANGES

* **commitlint:** The default commitlint configuration was changed to `@commitlint/config-conventional` (before: `@commitlint/config-angular`

### Features

* **commitlint:** use @commitlint/config-conventional ([6de7705](https://github.com/d-koppenhagen/ngx-semantic-version/commit/6de7705c4709cc80ed7e469aded1600af432ba58)), closes [#8](https://github.com/d-koppenhagen/ngx-semantic-version/issues/8)

### [0.0.4](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.0.3...v0.0.4) (2019-10-15)


### Bug Fixes

* **ng-update:** proceed update within correct version ([5b72d45](https://github.com/d-koppenhagen/ngx-semantic-version/commit/5b72d456109ff898ae09387d48b207ea305ca017))

### [0.0.3](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.0.1...v0.0.3) (2019-10-15)


### Features

* **commitizen:** adds commitizen as dependncy and husky hook ([87f316e](https://github.com/d-koppenhagen/ngx-semantic-version/commit/87f316e68358ba101adfd7b22b4ebd12f456e5fa))
* adds ng-update support ([04ea589](https://github.com/d-koppenhagen/ngx-semantic-version/commit/04ea589cea711759ce5b90f4f461871c7f5f513c)), closes [#1](https://github.com/d-koppenhagen/ngx-semantic-version/issues/1)
* removes `prepare-commit-msg` husky hook ([38d4a58](https://github.com/d-koppenhagen/ngx-semantic-version/commit/38d4a58eb32ce6e29b7c3ce27be192973fd19c38))

### [0.0.2](https://github.com/d-koppenhagen/ngx-semantic-version/compare/v0.0.1...v0.0.2) (2019-10-13)


### Features

* **commitizen:** adds commitizen as dependncy and husky hook ([87f316e](https://github.com/d-koppenhagen/ngx-semantic-version/commit/87f316e68358ba101adfd7b22b4ebd12f456e5fa))

### 0.0.1 (2019-10-12)


### Features

* adds initial version for ng add af00610
