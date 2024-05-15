const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const config = (_env, argv) => {
  console.log('argv.mode:', argv.mode)

  const backend_url = argv.mode === 'production' ? '' : 'http://localhost:3003'

  return {
    entry: './frontend/src/main.jsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
      publicPath: '/'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      }),
      new HtmlWebPackPlugin({
        template: './frontend/index.html',
        filename: './index.html',
      }),
    ],
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
  }
}

module.exports = config