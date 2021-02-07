const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
        screens: path.resolve(__dirname, 'src/screens'),
        store: path.resolve(__dirname, 'src/store'),
        styles: path.resolve(__dirname, 'src/styles'),
        assets: path.resolve(__dirname, 'src/assets'),
        components: path.resolve(__dirname, 'src/components'),
        helpers: path.resolve(__dirname, 'src/helpers'),
        firebaseDir: path.resolve(__dirname, 'src/fb-config'),
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "styles/variables.scss";
          @import "styles/mixins.scss";
          @import "styles/classes.scss";
          `,
      },
    },
  },
};
