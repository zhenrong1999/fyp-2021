module.exports = {
  moduleIds: "deterministic",
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
