import path from "node:path";

export function createProjectPaths(projectRoot) {
  const demoDir = path.join(projectRoot, "demo");
  const demoSourceDir = path.join(demoDir, "src");
  const demoSourceAssetsDir = path.join(demoSourceDir, "assets");
  const demoVendorDir = path.join(demoDir, "vendor");
  const demoOutputDir = path.join(demoDir, "dist");
  const demoOutputAssetsDir = path.join(demoOutputDir, "assets");

  return {
    projectRoot,
    distDir: path.join(projectRoot, "dist"),
    demoDir,
    demoSourceDir,
    demoSourceAssetsDir,
    demoSourceMediaDir: path.join(demoSourceAssetsDir, "media"),
    demoVendorDir,
    demoVendorRevealDir: path.join(demoVendorDir, "reveal"),
    demoOutputDir,
    demoOutputAssetsDir,
    demoOutputDeckzeroDir: path.join(demoOutputAssetsDir, "deckzero"),
    demoOutputIndexPath: path.join(demoOutputDir, "index.html"),
    demoOutputMediaDir: path.join(demoOutputAssetsDir, "media"),
    demoOutputRevealDir: path.join(demoOutputAssetsDir, "reveal"),
    demoMarkdownPath: path.join(demoSourceDir, "deck.md")
  };
}
