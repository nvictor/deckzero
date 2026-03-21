import fs from "node:fs/promises";

import { renderDocument } from "./document.mjs";
import { compileMarkdownDeck } from "./markdown.mjs";
import { createProjectPaths } from "./paths.mjs";

export { renderDocument } from "./document.mjs";
export { compileMarkdownDeck, formatHtml } from "./markdown.mjs";
export { createProjectPaths } from "./paths.mjs";

export async function buildDemo(projectRoot) {
  const paths = createProjectPaths(projectRoot);
  const markdown = await fs.readFile(paths.demoMarkdownPath, "utf8");
  const slidesHtml = compileMarkdownDeck(markdown);
  const documentHtml = renderDocument(slidesHtml);

  await fs.rm(paths.demoOutputDir, { recursive: true, force: true });
  await fs.mkdir(paths.demoOutputAssetsDir, { recursive: true });
  await fs.cp(paths.demoSourceMediaDir, paths.demoOutputMediaDir, { recursive: true });
  await fs.cp(paths.demoVendorRevealDir, paths.demoOutputRevealDir, { recursive: true });
  await fs.writeFile(paths.demoOutputIndexPath, documentHtml);

  return {
    paths,
    markdown,
    slidesHtml,
    documentHtml
  };
}

export async function syncDemoAssets(projectRoot) {
  const paths = createProjectPaths(projectRoot);
  await fs.mkdir(paths.demoOutputDeckzeroDir, { recursive: true });
  await fs.cp(paths.distDir, paths.demoOutputDeckzeroDir, { recursive: true });
  return paths;
}
