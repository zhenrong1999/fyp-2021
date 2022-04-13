module.exports = {
  entry: "./src/Electron/preload.ts",
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  optimization:  require("./webpack.optimization"),
};
