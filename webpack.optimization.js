module.exports = {
  runtimeChunk: true,
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
