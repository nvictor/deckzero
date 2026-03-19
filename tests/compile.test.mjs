import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compileMarkdownDeck, formatHtml } from "../scripts/compile-markdown.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

const sampleMarkdown = `
<!-- layout: split:text-image -->
# Sample

Paragraph with \`inline\` code.

- One
- Two

<div>
  <img src="assets/media/default.svg" alt="Sample image" />
</div>

---

\`\`\`html
<section>demo</section>
\`\`\`

![Alt text](assets/media/default.svg)
`;

const compiled = compileMarkdownDeck(sampleMarkdown);

assert.match(compiled, /<section>\s*<!-- layout: split:text-image -->/);
assert.match(compiled, /<h1>Sample<\/h1>/);
assert.match(compiled, /<p>Paragraph with <code>inline<\/code> code\.<\/p>/);
assert.match(compiled, /<ul>\s*<li>One<\/li>\s*<li>Two<\/li>\s*<\/ul>/);
assert.match(compiled, /<div>\s*<img src="assets\/media\/default\.svg" alt="Sample image" \/>\s*<\/div>/);
assert.match(compiled, /<pre><code class="language-html" data-trim>/);
assert.match(compiled, /<img src="assets\/media\/default\.svg" alt="Alt text" \/>/);

const deckMarkdown = await fs.readFile(path.join(projectRoot, "demo-md-src/deck.md"), "utf8");
const deckHtml = compileMarkdownDeck(deckMarkdown);
const generatedIndex = await fs.readFile(path.join(projectRoot, "demo-md/index.html"), "utf8");

assert.equal((deckHtml.match(/<section>/g) || []).length, 11);
assert.match(deckHtml, /<!-- layout: step -->/);
assert.match(deckHtml, /<div class="theme-toggle">/);
assert.match(deckHtml, /<p class="fragment">Start from the base system\.<\/p>/);
assert.match(deckHtml, /<img src="assets\/media\/default\.svg" alt="Hero image placeholder" \/>/);
assert.match(deckHtml, /<p class="dz-caption">Image with a short caption falls into the image-caption primitive\.<\/p>/);
assert.match(generatedIndex, /<section>\s*<!-- layout: title -->/);
assert.match(generatedIndex, /plugin\/markdown\.js/);
assert.match(generatedIndex, /^<!DOCTYPE html>\n<html lang="en">\n  <head>/);
assert.equal(formatHtml("<div>\n<p>Hi</p>\n</div>"), "<div>\n  <p>Hi</p>\n</div>\n");
assert.match(generatedIndex, /<title>deckzero demo<\/title>/);

console.log("deckzero compile tests passed");
