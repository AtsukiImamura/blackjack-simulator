const VueLoaderplugin = require("vue-loader/lib/plugin"); //vue-loader/lib/plugin
const path = require("path");

module.exports = {
  target: "web",
  //   watch: true,
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    view: "./src/index.ts",
    test: "./src/test/test.ts"
  },
  output: {
    path: path.join(__dirname, "./dist/public/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue/,
        loader: "vue-loader"
      },
      {
        test: /\.js/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.css/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss/,
        use: [
          //   { loader: MiniCssExtractPlugin.loader },
          {
            loader: "vue-style-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true
              //   minimize: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: path.resolve(
                __dirname,
                "./src/resources/sass/_variables.scss"
              )
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },

  //   externals: ["axios"],
  resolve: {
    extensions: [".ts", ".js", ".vue", ".scss"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },

  plugins: [new VueLoaderplugin()],
  node: {
    fs: "empty",
    net: "empty"
  }
};
