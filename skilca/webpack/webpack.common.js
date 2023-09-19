const path = require('path');

module.exports = {
  entry: './source/js/index.js', 
  resolve : {
      alias : { 
      // '@' : path.resolve(__dirname, "../"),
    } 
  },

  output: {
    filename: 'commonJs.min.js',
    publicPath: '/',
    path: path.join(__dirname, '..','output/js'),
    clean: true,
  },
  
  optimization: {
    chunkIds: "named",
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commonJs",
          // chunks: "initial",
          // minChunks: 2,
          // maxInitialRequests: 5, // The default limit is too small to showcase the effect
          // minSize: 0 // This is example is too small to create commons chunks
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, '..','source'),
          path.join(__dirname, '..','node_modules/swiper'),
          path.join(__dirname, '..','node_modules/dom7'),
        ],
        // exclude: /node_modules/,
        options: {
          configFile: './babel.config.js',
        }
      }
    ]
  },
};
