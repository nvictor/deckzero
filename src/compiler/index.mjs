import fs from "node:fs/promises";

import { renderDocument } from "./document.mjs";
import { compileMarkdownDeck } from "./markdown.mjs";
import { createProjectPaths } from "./paths.mjs";

export { renderDocument } from "./document.mjs";
export { compileMarkdownDeck, formatHtml } from "./markdown.mjs";
export { createProjectPaths } from "./paths.mjs";

export async function clearDemoDist(projectRoot) {
  const paths = createProjectPaths(projectRoot);
  await fs.rm(paths.demoDistDir, { recursive: true, force: true });
  return paths;
}

async function buildDeckOutput(paths, options = {}) {
  const {
    markdownPath = paths.demoMarkdownPath,
    outputDir = paths.demoOutputDir,
    outputAssetsDir = paths.demoOutputAssetsDir,
    outputMediaDir = paths.demoOutputMediaDir,
    outputRevealDir = paths.demoOutputRevealDir,
    outputDeckzeroDir = paths.demoOutputDeckzeroDir,
    outputIndexPath = paths.demoOutputIndexPath,
    documentOptions
  } = options;

  const markdown = await fs.readFile(markdownPath, "utf8");
  const slidesHtml = compileMarkdownDeck(markdown);
  const documentHtml = renderDocument(slidesHtml, documentOptions);

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputAssetsDir, { recursive: true });
  await fs.cp(paths.demoSourceMediaDir, outputMediaDir, { recursive: true });
  await fs.cp(paths.demoVendorRevealDir, outputRevealDir, { recursive: true });
  await fs.mkdir(outputDeckzeroDir, { recursive: true });
  await fs.cp(paths.distDir, outputDeckzeroDir, { recursive: true });
  await fs.writeFile(outputIndexPath, documentHtml);

  return {
    paths,
    markdown,
    slidesHtml,
    documentHtml,
    outputDir,
    outputIndexPath
  };
}

export async function buildDemo(projectRoot) {
  const paths = createProjectPaths(projectRoot);
  return buildDeckOutput(paths, {
    documentOptions: {
      title: "deckzero demo",
      defaultTheme: "dark",
      themeStylesheets: ["light", "hulk"]
    }
  });
}

export async function syncDemoAssets(projectRoot) {
  const paths = createProjectPaths(projectRoot);
  await fs.mkdir(paths.demoOutputDeckzeroDir, { recursive: true });
  await fs.cp(paths.distDir, paths.demoOutputDeckzeroDir, { recursive: true });
  return paths;
}
