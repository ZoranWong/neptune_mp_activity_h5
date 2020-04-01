let WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const process = require('process');
// let webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration')).development();
module.exports = {
  webpack: function(config, env) {
    // ...add your webpack config
    // console.log(JSON.stringify(config));
    // 去掉hash值，解决asset-require-hook资源问题
    console.log(env, process.env.NODE_ENV);
    config.module.rules.forEach(d => {
      d.oneOf &&
        d.oneOf.forEach(e => {
          if (e && e.options && e.options.name) {
            e.options.name = e.options.name.replace('[hash:8].', '');
          }
        });
    });
    return config;
  }
};
