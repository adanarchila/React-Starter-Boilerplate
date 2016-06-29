const webpack = require('webpack')
const webpackClean = require('clean-webpack-plugin')
const webpackMerge = require('webpack-merge')
const extractTextPlugin = require('extract-text-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const env = process.env.NODE_ENV
const siteTitle = 'Sequr - Dashboard'

let base = {
    context: path.join(__dirname, 'client'),
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      'font-awesome-loader',
      'bootstrap-loader',
      './index.js'
    ],
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        sourceMapFilename: '[file].map'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/,
            root: [path.join(__dirname, 'client')],
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.(scss|css)$/,
            loader: extractTextPlugin.extract(
                'style',
                `css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader`,
                'sass?sourceMap'
            )
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.(json)$/,
            loader: 'json-loader',
            exclude: /(node_modules|bower_components)/
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url?limit=10000"
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'client', 'index.html'),
            inject: 'body',
            title: siteTitle,
            favicon: path.join(__dirname, 'client', 'assets', 'favicon.ico')
        }),
    ],
    postcss: function () {
        return [
            require('postcss-inline-media'),
            require('precss'),
            require('postcss-flexbox'),
            require('autoprefixer'),
            require('postcss-short'),
        ]
    }
}

if (env === 'development') {
    module.exports = webpackMerge(base, {
        output: {
            filename: 'application.js'
        },
        watch: true,
        devtool: 'eval-source-map',
        plugins: [
            new extractTextPlugin('bundle.css', {
                allChunks: true
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    })
}

if (env === 'production') {
    module.exports = webpackMerge(base, {
        output: {
            filename: 'bundle.[hash].js'
        },
        plugins: [
            new webpackClean([path.join(__dirname, 'static')]),
            new extractTextPlugin('bundle.[hash].css', {
                allChunks: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    })
}
