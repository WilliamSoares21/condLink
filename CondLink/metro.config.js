const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {
      'idb': path.resolve(__dirname, './empty.js')
    },
    platforms: ['ios', 'android', 'native', 'web']
  },
  transformer: {
    ...config.transformer,
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true
      }
    }
  }
};