const path = require('path');
const webpack = require('webpack');

// const apiUrl = 'http://localhost:7000';
module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  devServer: {
    open: true,
    port: 9000,
    proxy: {
      '/api': {
        target: apiUrl,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  lintOnSave: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  chainWebpack: (config) => {
    ['index'].forEach((page) => {
      config.plugins.delete(`preload-${page}`);
      config.plugins.delete(`prefetch-${page}`);
    });
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        api: ['@/api', 'default'],
        GlobalToast: ['@/tool/GlobalToast', 'default'],
      }),
    ],
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
    },
    performance: {
      hints: false,
    },
  },
  productionSourceMap: false,
  css: {
    sourceMap: false,
    modules: false,
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          path.resolve(__dirname, './src/assets/theme.styl'),
        ],
      },
    },
  },
  parallel: require('os').cpus().length > 1,
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true,
    },
  },
};
