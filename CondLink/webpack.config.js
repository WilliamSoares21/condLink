// filepath: c:\Users\Daft\OneDrive\Área de Trabalho\CondLink\condLink\CondLink\webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Adicionar suporte para fontes do react-native-vector-icons
  config.module.rules.push({
    test: /\.(ttf|otf)$/,
    loader: 'url-loader',
    include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
  });

  return config;
};