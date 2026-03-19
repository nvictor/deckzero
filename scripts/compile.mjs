import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compileMarkdownDeck } from "./compile-markdown.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const sourceDir = path.join(projectRoot, "demo-md-src");
const outputDir = path.join(projectRoot, "demo-md");
const markdownPath = path.join(sourceDir, "deck.md");
const demoAssetsDir = path.join(projectRoot, "demo", "assets");
const outputAssetsDir = path.join(outputDir, "assets");
const outputIndexPath = path.join(outputDir, "index.html");

function indentBlock(value, indent) {
  return String(value)
    .trim()
    .split("\n")
    .map(function (line) {
      return line ? " ".repeat(indent) + line : "";
    })
    .join("\n");
}

function renderDocument(slidesHtml) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>deckzero demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="assets/reveal/reset.css" />
    <link rel="stylesheet" href="assets/reveal/reveal.css" />
    <link rel="stylesheet" href="assets/reveal/plugin/highlight/monokai.css" />

    <link rel="stylesheet" href="assets/deckzero/deckzero.css" />
    <link rel="stylesheet" href="assets/deckzero/themes/light.css" />

    <style>
      .theme-toggle {
        display: inline-flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .theme-toggle button {
        border: 0;
        border-radius: 999px;
        padding: 0.7rem 1rem;
        cursor: pointer;
        font: inherit;
        color: inherit;
        background: rgba(148, 163, 184, 0.16);
      }
    </style>
  </head>
  <body>
    <div
      class="reveal"
      data-dz-brand-src="assets/media/default.svg"
      data-dz-brand-style="logo"
      data-dz-brand-position="top-right"
      data-dz-brand-alt="deckzero"
    >
      <div class="slides">
${indentBlock(slidesHtml, 8)}
      </div>
    </div>
    <script src="assets/reveal/reveal.js"></script>
    <script src="assets/reveal/plugin/zoom.js"></script>
    <script src="assets/reveal/plugin/notes.js"></script>
    <script src="assets/reveal/plugin/search.js"></script>
    <script src="assets/reveal/plugin/markdown.js"></script>
    <script src="assets/reveal/plugin/highlight.js"></script>
    <script src="assets/deckzero/deckzero.js"></script>
    <script>
      Reveal.initialize({
        controls: true,
        progress: true,
        hash: true,
        center: true,
        transition: "fade",
        backgroundTransition: "fade",
        plugins: [RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight]
      });
    </script>
  </body>
</html>
`;
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const markdown = await fs.readFile(markdownPath, "utf8");
const slidesHtml = compileMarkdownDeck(markdown);
const documentHtml = renderDocument(slidesHtml);

await fs.cp(demoAssetsDir, outputAssetsDir, { recursive: true });
await fs.writeFile(outputIndexPath, documentHtml);

console.log("Compiled demo-md/index.html from demo-md-src/deck.md");
