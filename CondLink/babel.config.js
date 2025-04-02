module.exports = {
  presets: [
    'module:metro-react-native-babel-preset', // Core do React Native
    'babel-preset-expo', // Preset específico do Expo
    '@babel/preset-react' // Para suporte a JSX
  ],
  plugins: [
    'react-native-reanimated/plugin', // Para animações
    'react-native-web' // Para suporte web (opcional se não usar web)
  ]
};
