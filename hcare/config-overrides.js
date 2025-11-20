const path = require("path");
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      url: require.resolve("url/"),
      vm: require.resolve("vm-browserify"),
      process: require.resolve("process/browser"),
    },
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      process: "global.process || { env: {} }",
      "process.env": JSON.stringify(process.env),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /readable-stream\/lib\/_stream_writable\.js$/,
      contextRegExp: /readable-stream/,
    }),
  ]);

  return config;
};
