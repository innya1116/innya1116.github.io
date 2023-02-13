const {merge} = require('webpack-merge');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = (env) => {
  const setup = {
    mode: 'production',
    target: ['web', 'es5'], 
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        terserOptions: {
            format: {
              comments: false,
            },
            compress:{
              drop_console: true,          
            }           
        },
        extractComments: false,
      })],
    }
  }

  return merge(common, setup)
} 