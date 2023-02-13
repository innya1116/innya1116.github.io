// babel.config.js
module.exports = function(api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["defaults", "not IE 11"]
        },
        useBuiltIns: "usage",
        corejs: 3,
        debug: true,
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