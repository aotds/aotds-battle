const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\.svg$/, loader: 'svg-sprite-loader' },
    ],
    loaders: [
      { test: /\.svg$/, loader: 'svg-sprite-loader' },
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {  test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass"] },
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
}
