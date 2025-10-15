module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',

    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@utils': './src/utils',
          '@screen': './src/screen',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
