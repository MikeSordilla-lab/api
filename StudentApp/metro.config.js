const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude testsprite_tests directory from watching
config.watchFolders = config.watchFolders || [];
config.projectRoot = __dirname;

// Configure the file blacklist to exclude testsprite_tests
const defaultBlacklist =
  require("metro-config").getDefaultConfig(__dirname).blacklistRE;
config.blacklistRE = require("metro-config").getBlacklistRE([
  ...require("metro-config").getBlacklistRE.getDefaultBlacklist(),
  /testsprite_tests.*\/.*/,
]);

module.exports = config;
