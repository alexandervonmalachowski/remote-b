const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackRemoteTypesPlugin = require("webpack-remote-types-plugin").default;
const FileManagerWebPackPlugin = require("filemanager-webpack-plugin");

const moduleFederationConfig = {
  name: "remote_b",
  filename: "remoteEntry.js",
  exposes: {
    "./remote_b": "./src/pages/remote-b",
    "./remote_b_routes": "./src/utils/routes",
  },
  remotes: {},
  shared: {
    ...deps,
    react: { singleton: true, eager: true, requiredVersion: deps.react },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: deps["react-dom"],
    },
    "react-router-dom": {
      singleton: true,
      eager: true,
      requiredVersion: deps["react-router-dom"],
    },
  },
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  return {
    entry: "./src/index.ts",
    mode: "development",
    output: {
      publicPath: "auto",
    },
    devServer: {
      port: 3002,
      open: false,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
        {
          test: /\.(tsx|ts)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "dts-loader",
              options: {
                name: moduleFederationConfig.name, // The name configured in ModuleFederationPlugin
                exposes: moduleFederationConfig.exposes,
                typesOutputDir: "exposedTypes", // Optional, default is '.wp_federation'
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  localIdentName: "[name]_[local]_[sha1:hash:hex:4]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new ModuleFederationPlugin(moduleFederationConfig),
      new WebpackRemoteTypesPlugin({
        remotes: moduleFederationConfig.remotes,
        outputDir: "types/[name]",
        remoteFileName: "[name]-dts.tgz",
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new ForkTsCheckerWebpackPlugin(),
      new FileManagerWebPackPlugin({
        events: {
          onEnd: {
            archive: [
              {
                source: `./exposedTypes/${moduleFederationConfig.name}`,
                destination: `./${isProduction ? "dist" : "public"}/${
                  moduleFederationConfig.name
                }-dts.tgz`,
                format: "tar",
                options: {
                  gzip: true,
                },
              },
            ],
          },
        },
      }),
    ],
  };
};
