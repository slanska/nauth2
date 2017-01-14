/**
 * Created by slanska on 2016-10-24.
 */

/*
 Bundles scripts and css for /public portion of site
 */

var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        index: path.join(__dirname, './public/app/userController.ts'),
        admin: path.join(__dirname, './public/app/adminController.ts')
    },

    output: {
        path: './public/_build',
        filename: "[name].js",
        libraryTarget: "umd"
    },
    resolve: {
        alias: {
            'framework7': path.join(__dirname, './public/bower_components/Framework7/dist/js/framework7.min.js'),
            'framework7-vue': path.join(__dirname, './public/bower_components/Framework7-Vue/dist/framework7-vue.min.js'),
            'feathers-client': path.join(__dirname, './public/bower_components/feathers-client/dist/feathers.min.js'),
            'lodash': path.join(__dirname, './public/bower_components/lodash/dist/lodash.min.js'),
            'vue': path.join(__dirname, './public/bower_components/vue/dist/vue.min.js'),
            'promiz': path.join(__dirname, './public/bower_components/promiz/promiz.min.js')
        },
        extensions: ['', '.vue', '.ts', '.js', '.jsx', '.json', '.tsx']
    },
    // Empty list of plugins
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(
            {
                names: ['admin', 'index', 'components'], chunks: ['admin', 'index']
            }),

        // new webpack.optimize.UglifyJsPlugin({
        //     test: /components\.js/,
        //     debug: true,
        //     minimize: true,
        //     sourceMap: true,
        //     output: {
        //         comments: false
        //     },
        //     compressor: {
        //         warnings: false
        //     }
        // })
    ],

    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style!css",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};