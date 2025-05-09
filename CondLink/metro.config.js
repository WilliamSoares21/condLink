const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Otimizações para evitar problemas de bundle
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.transformer.minifierPath = 'metro-minify-terser';

module.exports = config;