const {merge} = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common.js');

module.exports = (env) => {
  const setup = {
    cache: {
      type: 'filesystem',
    },
    mode: 'development',
    target: ['web', 'es5'],
    devtool: 'inline-source-map',
    watchOptions: {
      poll: true,
      ignored: '/node_modules/',
    },
  }
  
  return merge(common, setup)
}
