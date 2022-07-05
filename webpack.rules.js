module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    resolve: {
      fallback: {
        assert: require.resolve("assert"),
        // buffer: require.resolve("buffer"),
        // console: require.resolve("console-browserify"),
        constants: require.resolve("constants-browserify"),
        // crypto: require.resolve("crypto-browserify"),
        // domain: require.resolve("domain-browser"),
        // events: require.resolve("events"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        // os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify"),
        // fs: require.rersolve("fs"),
        // punycode: require.resolve("punycode"),
        // process: require.resolve("process/browser"),
        // querystring: require.resolve("querystring-es3"),
        stream: require.resolve("stream-browserify"),
        // string_decoder: require.resolve("string_decoder"),
        // sys: require.resolve("util"),
        // timers: require.resolve("timers-browserify"),
        // tty: require.resolve("tty-browserify"),
        url: require.resolve("url"),
        util: require.resolve("util"),
        // vm: require.resolve("vm-browserify"),
        zlib: require.resolve("browserify-zlib"),
      },
    },
  },
];
