module.exports = {
  devServer: {
    disableHostCheck: true,
    port: process.env.DEV_SERVER_PORT || 8080,
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        },
      },
    },
  },
};