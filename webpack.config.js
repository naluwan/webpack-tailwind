const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  target: "web",
  // 入口
  entry: "./src/index.js",

  // 模式：development, production
  // production: 所有程式碼都會被壓縮，減少容量，使用時會開啟Tree shaking的功能
  // 最後一定要開啟production再將檔案壓出來，容量會差很多
  // development: 程式碼內會有註解，且會分段
  mode: "development",
  // 出口
  output: {
    // 出口資料夾
    path: path.resolve(__dirname, "dist"),
    // 出口檔案名稱
    // 使用hash，會自動產生亂碼，讓每次壓出來的檔案名稱都不一樣
    // 讓瀏覽器cache不會因為檔案名稱一樣而沒有更新
    filename: "index.[hash].js",
  },

  // loader 負責讓webpack看得懂東西
  // loader 只負責讀取
  module: {
    rules: [
      {
        // 解析CSS
        // MiniCssExtractPlugin是將css抽離成獨自一個檔案的插件
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // options是用來解決如過在檔案中有用到import時，postcss也會有辦法讀懂
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          // 引入postcss，一般會使用autoprefixer來增加瀏覽器前綴
          // 解決不同瀏覽器不同css的問題
          { loader: "postcss-loader" },
        ],
      },
      {
        // 解析圖片資源
        // 有大小限制，需配合下方設定performance
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        type: "asset/resource",
      },
      {
        // 處理javascript
        test: /\.m?js$/,
        // 忽略node_nodules資料夾
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  // plugins(插件) - 做讀取以外的事，例如產生html檔案
  // template可以指定一個html檔案讓webpack可以當作模板
  plugins: [
    // 產生html的插件
    new HtmlWebpackPlugin({
      // 設定模板檔案
      template: "./src/index.html",
    }),
    // 抽離CSS的插件
    new MiniCssExtractPlugin({
      // 設定檔案名稱
      filename: "index.[hash].css",
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
  ],

  // 在瀏覽器開啟devtool時，可以看到原始碼，而不是編譯過後的程式碼，方便debug
  devtool: "source-map",

  // 資源大小只要超過一定大小就會跳錯誤，這邊設定將限制提高
  // performance: { maxEntrypointSize: 10000000, maxAssetSize: 30000000 },
};
