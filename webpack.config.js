const express = require("express");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require('fs');

module.exports = {
  entry: "./src/app.js", 
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  module:{
    rules:[
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        }
   ]
},
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    open: true,
    port: 9000,
    before: function(app, server) {
      app.use("/api", express.static(path.join(__dirname, "data")));
      app.get('/api/users', function (req, res) {
        fs.readFile('./data/users.json', function (err, buffer) {
          res.send(buffer);
        })
      });
      app.get('/api/orders', function (req, res) {
        fs.readFile('./data/orders.json', function (err, buffer) {
          res.send(buffer);
        })
      });
      app.get('/api/companies', function (req, res) {
        fs.readFile('./data/companies.json', function (err, buffer) {
          res.send(buffer);
        })
      });
    }
  },
  node: {
    fs: 'empty'
  }
};
