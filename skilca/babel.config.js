// babel.config.js
module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["> 1%", "last 2 versions", "IE >= 11"]
        },
        useBuiltIns: "usage",
        corejs: 3,
        debug: false,
        shippedProposals: true
      }
    ]
  ];
  const plugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime"
  ];

  return {
    presets,
    plugins
  };
};