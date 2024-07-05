const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('webpack-dev', {
  entry: path.resolve(__dirname, 'example'),
  output: {
    path: path.resolve(__dirname, 'example/dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@edx/frontend-component-header': path.resolve(__dirname, 'src'),
      hooks: path.resolve(__dirname, 'src/common/hooks'), // Adjust to the actual hooks path
    },
  },
});
