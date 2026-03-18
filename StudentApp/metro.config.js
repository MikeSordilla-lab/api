const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure projectRoot is set correctly
config.projectRoot = __dirname;

module.exports = config;
