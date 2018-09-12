'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const chalk = require('chalk');
const resolve = require('resolve');

const NODE_ENV = process.env.NODE_ENV;
const CONFIG_BASEDIR = process.env.CONFIG_BASEDIR || process.env.NODE_CONFIG_BASEDIR;
const CONFIG_DIR = process.env.CONFIG_DIR || process.env.NODE_CONFIG_DIR;

// get application parameters, except keys with '_' '$0'
const argv = require('optimist').argv;
const CONFIG = _.merge({}, JSON.parse(process.env.CONFIG || process.env.NODE_CONFIG || '{}'), _.omit(argv, '_', '$0'));

module.exports = function configLite(customOpt) {
  // change path string to a map
  let config = {};
  if (!_.isPlainObject(customOpt)) {
    if (customOpt && _.isString(customOpt)) {
      customOpt = { config_basedir: customOpt };
    } else {
      throw new TypeError('config-lite custom option should be a string or an object');
    }
  }
  const opt = {
    filename: NODE_ENV || customOpt.filename || 'default',
    config_basedir: CONFIG_BASEDIR || customOpt.config_basedir,
    config_dir: CONFIG_DIR || customOpt.config_dir || 'config'
  };

  // get aimed profile config file
  if (opt.filename !== 'default') {
    try {
      let tempConfig = {}
      let filenames = fs.readdirSync(customOpt.config_basedir + "/")
      filenames.forEach((filename) => {
        filename = _.split(filename, '.', 1)[0]
        if(filename.indexOf(opt.filename) !== -1) {
          let fileConfig = loadConfigFile(filename, opt);
          tempConfig = _.merge(tempConfig, fileConfig);
        }
      })

      config = tempConfig;
    } catch (e) {
      console.error(chalk.red('config-lite load "' + opt.filename + '" failed.'));
      console.error(chalk.red(e.stack));
    }
  }

  // get default config file, and is merged by profile config
  try {
    let tempConfig = {}
    let filenames = fs.readdirSync(customOpt.config_basedir + "/")
    filenames.forEach((filename) => {
      filename = _.split(filename, '.', 1)[0]
      if(filename.indexOf('default') !== -1) {
        let fileConfig = loadConfigFile(filename, opt);
        tempConfig = _.merge(tempConfig, fileConfig);
      }
    })
    config = _.merge({}, tempConfig, config);
  } catch (e) {
    console.error(chalk.red('config-lite load "default" failed.'));
    console.error(chalk.red(e.stack));
  }

  // custom options merge below configs
  // environment vars merge below configs
  // and return
  return _.merge({}, config, customOpt.config, CONFIG);
}

function loadConfigFile(filename, opt) {
  const filepath = resolve.sync(filename, {
    basedir: opt.config_basedir,
    extensions: ['.js', '.json', '.node', '.yaml', '.yml', '.toml'],
    moduleDirectory: opt.config_dir
  });
  if (/\.ya?ml$/.test(filepath)) {
    return require('js-yaml').safeLoad(fs.readFileSync(filepath , 'utf8'));
  } else if (/\.toml$/.test(filepath)) {
    return require('toml').parse(fs.readFileSync(filepath , 'utf8'));
  } else {
    return require(filepath);
  }
}
