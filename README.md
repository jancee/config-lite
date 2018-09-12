## Improve
The project comes from https://github.com/nswbmw/config-lite  

And, improvements include: 

1. Support multiple configurations, which are merged rather than configured

2. Support to load all sub-configuration items of profile

## config-lite

A super simple & flexible & intuitive config module, support `yaml` & `toml`.

### Install

```bash
$ npm i config-lite --save
```

### Migration

In v1:

```js
const config = require('config-lite');
```

In v2, you should specify `config_basedir` directory for bubbling find config file.

```js
const config = require('config-lite')(__dirname);
```

### Usage

```js
const config = require('config-lite')(__dirname);
```

or:

```js
const config = require('config-lite')({
  filename: 'test',
  config_basedir: __dirname,
  config_dir: 'config'
});
```

### Options

- filename: config file name, default: `default`, support: `['.js', '.json', '.node', '.yaml', '.yml', '.toml']`.
- config_basedir: directory for begining bubbling find config directory.
- config_dir: config directory name, default: `config`.
- config: default config object that overwrite config files.

### Priority

environment option > custom option > default option

For example:

```bash
$ NODE_ENV=test NODE_CONFIG='{"port":3000}' node app.js --port=3001
```

loading order:

`--port=3001` > `NODE_CONFIG='{"port":3000}'` > opt.config > test config file > default config files

### Environment Variables

- NODE_ENV -> filenames, such as, `default`, `default-mysql`, `default-mongodb`, and etc.
- CONFIG_BASEDIR || NODE_CONFIG_BASEDIR -> config_dirname
- CONFIG_DIR || NODE_CONFIG_DIR -> config_dir
- CONFIG || NODE_CONFIG -> config

### Test

```bash
$ npm test
```

### License

MIT
