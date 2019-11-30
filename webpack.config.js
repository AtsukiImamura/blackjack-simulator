// const VueLoaderplugin = require("vue-loader/lib/plugin"); //vue-loader/lib/plugin
const path = require("path");

module.exports = {
  target: "web",
  //   watch: true,
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    index: "./src/main/index.ts",
    test: "./src/test/test.ts"
  },
  output: {
    path: path.join(__dirname, "./"),
    filename: "[name].js"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
        // options: {
        //   appendTsSuffixTo: [/\.vue$/]
        // }
      }
    ]
  },
  // exclude: ["node_modules"],
  //   externals: ["axios"],
  resolve: {
    extensions: [".ts", ".js" /*".vue", ".scss"*/]
    // alias: {
    //   vue$: "vue/dist/vue.esm.js"
    // }
  }

  // plugins: [new webpack.SourceMapDevToolPlugin({})]
  // plugins: [new VueLoaderplugin()],
  // node: {
  //   fs: "empty",
  //   net: "empty"
  // }
};
