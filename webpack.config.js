var webpack = require('webpack');

module.exports = {
    output: {
        path: __dirname + '/app',
        filename: 'application.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }],
        rules: [{
            test: /\.html$/,
            use: [ {
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }]
        }]
    }
};