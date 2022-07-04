path = require("path");
rules = require("./webpack.rules");
plugins = require("./webpack.plugins");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});
rules.push({
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: "asset/resource",
  // generator: { filename: "fonts/[name][ext]" },
});

CopyPlugin = require("copy-webpack-plugin");

plugins.push(
  new CopyPlugin({
    patterns: [
      {
        from: path.join(
          path.dirname(
            require.resolve("react-pdf/node_modules/pdfjs-dist/package.json")
          ),
          "cmaps"
        ),
        to: "pdfjs-dist/cmaps/",
      },
      {
        from: path.join(
          path.dirname(
            require.resolve("react-pdf/node_modules/pdfjs-dist/package.json")
          ),
          "build"
        ),
        to: "pdfjs-dist/build/",
      },
    ],
  })
);

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },

  optimization: require("./webpack.optimization"),
};
