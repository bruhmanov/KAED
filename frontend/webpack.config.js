const path = require('node:path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const apiProxyTarget = process.env.API_PROXY_TARGET

module.exports = {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash:8].js',
    chunkFilename: 'assets/[name].[contenthash:8].chunk.js',
    publicPath: './',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|svg|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env.KAED_API_URL': JSON.stringify(process.env.KAED_API_URL || ''),
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    allowedHosts: 'all',
    hot: true,
    client: {
      overlay: false,
    },
    proxy: apiProxyTarget
      ? [
          {
            context: ['/auth', '/tasks', '/jira', '/voice', '/health'],
            target: apiProxyTarget,
            changeOrigin: true,
            secure: false,
          },
        ]
      : [],
  },
  performance: {
    hints: false,
  },
}
