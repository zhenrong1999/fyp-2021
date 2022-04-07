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
        from: "node_modules/@fluentui/font-icons-mdl2/fonts/",
        to: "fonts",
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
  // target: "electron-renderer",
};
