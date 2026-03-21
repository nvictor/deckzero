import assert from "node:assert/strict";

import { compileMarkdownDeck, formatHtml } from "../../src/compiler/index.mjs";

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
assert.equal(formatHtml("<div>\n<p>Hi</p>\n</div>"), "<div>\n  <p>Hi</p>\n</div>\n");

console.log("deckzero markdown compiler tests passed");
