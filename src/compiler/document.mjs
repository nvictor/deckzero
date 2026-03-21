import { formatHtml } from "./markdown.mjs";

function indentBlock(value, indent) {
  return String(value)
    .trim()
    .split("\n")
    .map(function (line) {
      return line ? " ".repeat(indent) + line : "";
    })
    .join("\n");
}

export function renderDocument(slidesHtml) {
  return formatHtml(`<!DOCTYPE html>
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
        plugins: [RevealZoom, RevealNotes, RevealSearch, RevealHighlight]
      });
    </script>
  </body>
</html>
`);
}
