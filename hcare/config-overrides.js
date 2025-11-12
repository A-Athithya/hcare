const path = require("path");

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
    },
  };
  return config;
};
