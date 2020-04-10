let WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
// const process = require('process');
// let webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration')).development();
const path = require('path');
const fs = require('fs');
const DEV_CONFIG = 'src/config/app.dev.js';
const CONFIG = 'src/config/app.js';
const PROD_CONFIG = 'src/config/app.prod.js';

function ToolConfigLoader (env) {
    switch (env) {
        case 'dev': {
            loadConfig(DEV_CONFIG, CONFIG);
            break;
        }
        case 'prod': {
            loadConfig(PROD_CONFIG, CONFIG);
            break;
        }
        default: {
            loadConfig(DEV_CONFIG, CONFIG);
            break;
        }
    }
}

function loadConfig (configPath, distConfigPath) {
    configPath = path.join(__dirname, configPath);
    distConfigPath = path.join(__dirname, distConfigPath);
    fs.readFile(configPath, 'utf8', function (error, config) {
        if (error) {
            console.log('set front env config fail', error);
        } else {
            fs.writeFile(distConfigPath, config, function () {});
        }
    });
}

module.exports = {
    webpack: function(config, env) {
        // ...add your webpack config
        // console.log(JSON.stringify(config));
        // 去掉hash值，解决asset-require-hook资源问题
        console.log('-------------------------------------- +++++++++++++++++++++++++++', env);
        // ToolConfigLoader(process.env.APP_ENV);
        console.log(env, process.env.APP_ENV);
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
