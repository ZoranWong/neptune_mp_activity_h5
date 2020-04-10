let WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
// const process = require('process');
// let webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration')).development();
const path = require('path');
const fs = require('fs');


module.exports = {
    webpack: function(config, env) {
        console.log('-------------------------------------- +++++++++++++++++++++++++++', env);
        process.APP_ENV = process.env.APP_ENV;
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
