/**
 * Created by peak on 15/9/23.
 */
var webpack = require("webpack")
//头部信息
var pkg = require('../package.json');
var d = new Date()
var date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
var banner = "Vue Markdown " + pkg.version + "\n " + date + " Peak Tai\nhttps://github.com/PeakTai/vue-markdown.git"
module.exports = {
    context: __dirname + "/../",
    entry: {
        "vue-markdown": "./src/vue-markdown.js"
    },
    output: {
        path: __dirname + "/../dist",
        filename: "[name].js",
        library: 'VueMarkdown',
        libraryTarget: 'umd'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ],
        loaders: [
            {test: /(\.html)$/, loader: "html"},
            {test: /\.vue$/, loader: "vue-loader"}
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //})
    ],
    //devtool: "#source-map"
}