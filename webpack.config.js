/**
 * Created by slanska on 2016-10-24.
 */

/*
 Bundles scripts and css for /public portion of site
 */

var path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        index: path.join(__dirname, './public/app/userController'),
        admin: path.join(__dirname, './public/app/adminController'),
        profile: path.join(__dirname, './public/app/profileController')
    },

    output: {
        path: './public/_build',
        filename: "[name].js",
        libraryTarget: "umd"
    },
    resolve: {
        alias: {
            'framework7': path.join(__dirname, './public/bower_components/Framework7/dist/js/framework7.js'),
            'framework7-vue': path.join(__dirname, './public/bower_components/Framework7-Vue/dist/framework7-vue.js'),
            'feathers-client': path.join(__dirname, './public/bower_components/feathers-client/dist/feathers.js'),
            'lodash': path.join(__dirname, './public/bower_components/lodash/dist/lodash.js'),
            'vue': path.join(__dirname, './public/bower_components/vue/dist/vue.js')
        },
        extensions: ['', '.ts', '.js', '.json', '.tsx']
    },
    // Empty list of plugins
    plugins: [],
    module: {
        loaders: [
            {
                test: /\.css$/, loader: "style!css"
            },
            {
                test: /\.tsx?$/, loader: 'ts-loader'
            }
        ]
    }
};