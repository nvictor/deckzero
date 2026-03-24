import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemo, clearDemoDist, compileMarkdownDeck, createProjectPaths, syncDemoAssets } from "../../src/compiler/index.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../..");
const paths = createProjectPaths(projectRoot);

const deckMarkdown = await fs.readFile(paths.demoMarkdownPath, "utf8");
const deckHtml = compileMarkdownDeck(deckMarkdown);

assert.equal((deckHtml.match(/<section>/g) || []).length, 14);
assert.match(deckHtml, /<!-- layout: step -->/);
assert.match(deckHtml, /<div class="theme-toggle">/);
assert.match(deckHtml, /<p class="fragment">Start from the base system\.<\/p>/);
assert.match(deckHtml, /<img src="assets\/media\/default\.svg" alt="Hero image placeholder" \/>/);
assert.match(deckHtml, /<p class="dz-caption">Image with a short caption falls into the image-caption primitive\.<\/p>/);
assert.match(deckHtml, /<div class="dz-card-grid" data-dz-columns="3">/);
assert.match(deckHtml, /class="dz-card dz-tone-warning fragment"/);
assert.match(deckHtml, /<div class="dz-sequence" data-dz-columns="4">/);
assert.match(deckHtml, /<span class="dz-step-badge">3<\/span>/);

await clearDemoDist(projectRoot);
await buildDemo(projectRoot);
await syncDemoAssets(projectRoot);

const generatedIndex = await fs.readFile(paths.demoOutputIndexPath, "utf8");
const baseCss = await fs.readFile(path.join(paths.distDir, "deckzero.css"), "utf8");
const lightThemeCss = await fs.readFile(path.join(paths.distDir, "themes", "light.css"), "utf8");
const hulkThemeCss = await fs.readFile(path.join(paths.distDir, "themes", "hulk.css"), "utf8");
await fs.stat(path.join(paths.demoOutputRevealDir, "reveal.js"));
await fs.stat(path.join(paths.demoOutputDeckzeroDir, "deckzero.js"));
await fs.stat(path.join(paths.demoOutputMediaDir, "default.svg"));

assert.match(generatedIndex, /<section>\s*<!-- layout: title -->/);
assert.match(generatedIndex, /^<!DOCTYPE html>\n<html lang="en">\n  <head>/);
assert.match(generatedIndex, /<title>deckzero demo<\/title>/);
assert.match(generatedIndex, /assets\/deckzero\/themes\/hulk\.css/);
assert.match(generatedIndex, /data-dz-theme="dark"/);
assert.match(generatedIndex, />Hulk<\/button>/);
assert.doesNotMatch(generatedIndex, /plugin\/markdown\.js/);
assert.match(generatedIndex, /dz-card-grid/);
assert.match(generatedIndex, /dz-sequence-node/);
assert.equal(paths.demoOutputDir, paths.demoDistDir);
assert.doesNotMatch(baseCss, /section\[data-dz-accent\]\s+h1/);
assert.doesNotMatch(baseCss, /section\[data-dz-accent\]\s+\.dz-pane\[data-dz-pane-mode="text"\]/);
assert.doesNotMatch(lightThemeCss, /section\[data-dz-accent\]\s+\.dz-pane\[data-dz-pane-mode="text"\]/);
assert.match(lightThemeCss, /--dz-heading: var\(--dz-fg\);/);
assert.match(lightThemeCss, /--dz-emphasis: var\(--dz-fg\);/);
assert.match(baseCss, /--dz-heading: var\(--dz-fg\);/);
assert.match(baseCss, /\.reveal :is\(b, strong, em\) \{/);
assert.match(hulkThemeCss, /--dz-accent: #16b61b;/);
assert.match(hulkThemeCss, /--dz-heading: var\(--dz-accent\);/);
assert.match(hulkThemeCss, /--dz-emphasis: var\(--dz-accent\);/);
assert.match(hulkThemeCss, /--dz-bg: #f4fbf4;/);
assert.match(hulkThemeCss, /--dz-fg: #143016;/);

console.log("deckzero demo build tests passed");
