let path = require('path');
let webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "./src/main.js"),
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {test: /\.less$/i,  use: ExtractTextPlugin.extract([ 'css-loader', 'less-loader'])},
            {test: /\.css/i,  use: ExtractTextPlugin.extract(['css-loader'])},
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query: {presets: ['react']}},
            {enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader"},
            {test: /\.(gif|jpe?g|png|svg)$/, loader: 'url-loader?limit=25000'}, 
            {test: /\.(eot|ttf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'}
        ]
    },
    plugins: [
       new ExtractTextPlugin("styles.css")
    ]
};
