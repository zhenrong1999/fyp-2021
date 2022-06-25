const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  minimize: true,
  minimizer: [new TerserPlugin()],
  splitChunks: {
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        // chunks: "all",
        reuseExistingChunk: true,
      },
    },
  },
};
