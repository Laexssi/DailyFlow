const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
        screens: path.resolve(__dirname, 'src/screens'),
        styles: path.resolve(__dirname, 'src/styles'),
        components: path.resolve(__dirname, 'src/components'),
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
