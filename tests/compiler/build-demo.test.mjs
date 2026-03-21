import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemo, compileMarkdownDeck, createProjectPaths, syncDemoAssets } from "../../src/compiler/index.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "../..");
const paths = createProjectPaths(projectRoot);

const deckMarkdown = await fs.readFile(paths.demoMarkdownPath, "utf8");
const deckHtml = compileMarkdownDeck(deckMarkdown);

assert.equal((deckHtml.match(/<section>/g) || []).length, 11);
assert.match(deckHtml, /<!-- layout: step -->/);
assert.match(deckHtml, /<div class="theme-toggle">/);
assert.match(deckHtml, /<p class="fragment">Start from the base system\.<\/p>/);
assert.match(deckHtml, /<img src="assets\/media\/default\.svg" alt="Hero image placeholder" \/>/);
assert.match(deckHtml, /<p class="dz-caption">Image with a short caption falls into the image-caption primitive\.<\/p>/);

await buildDemo(projectRoot);
await syncDemoAssets(projectRoot);

const generatedIndex = await fs.readFile(paths.demoOutputIndexPath, "utf8");
await fs.stat(path.join(paths.demoOutputRevealDir, "reveal.js"));
await fs.stat(path.join(paths.demoOutputDeckzeroDir, "deckzero.js"));
await fs.stat(path.join(paths.demoOutputMediaDir, "default.svg"));

assert.match(generatedIndex, /<section>\s*<!-- layout: title -->/);
assert.match(generatedIndex, /^<!DOCTYPE html>\n<html lang="en">\n  <head>/);
assert.match(generatedIndex, /<title>deckzero demo<\/title>/);
assert.doesNotMatch(generatedIndex, /plugin\/markdown\.js/);

console.log("deckzero demo build tests passed");
