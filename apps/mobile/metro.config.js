// Metro config — lets the React Native app import the SHARED, platform-agnostic core
// that lives outside this package (repo-root `lib/`), instead of duplicating it.
//
//   import { CHART_TYPE_LABELS, chartTheme } from "@core/chart";
//
// Metro won't resolve files outside the project root unless we (a) add them to watchFolders
// so changes hot-reload, and (b) alias them via extraNodeModules so imports resolve.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the shared core so edits to lib/ hot-reload in the app.
config.watchFolders = [path.resolve(repoRoot, "lib")];

// 2. Resolve "@core/*" to the repo-root lib/*, while keeping this app's own node_modules first.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@core": path.resolve(repoRoot, "lib"),
};
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(repoRoot, "node_modules"),
];

module.exports = config;
