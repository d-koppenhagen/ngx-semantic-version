# ngx-semantic-version

[![npm](https://img.shields.io/npm/v/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)
[![npm](https://img.shields.io/npm/l/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

[![npm](https://img.shields.io/npm/dw/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)
[![npm](https://img.shields.io/npm/dm/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)
[![npm](https://img.shields.io/npm/dy/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)
[![npm](https://img.shields.io/npm/dt/ngx-semantic-version.svg)](https://www.npmjs.com/package/ngx-semantic-version)

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

## How to use

### Add it to your angular project

Just run the following command:

```sh
ng add ngx-semantic-version
```

## Development

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with

```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
