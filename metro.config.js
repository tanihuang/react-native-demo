const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const config = getDefaultConfig(__dirname);

// ignore
config.resolver.blockList = exclusionList([
  /scripts\/reset-assets\.js$/,
]);

config.resolver.sourceExts.push('cjs');

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
