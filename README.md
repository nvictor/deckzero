# deckzero

`deckzero` is an opinionated, CSS-first design system for Reveal.js-style presentations.

It provides:

- a minimal token layer
- six slide primitives
- token-only theme overrides
- a tiny runtime that reads slide hints and applies auto-layout heuristics
- an optional markdown-to-HTML compile workflow for demo and authoring convenience

## Package Shape

- `dist/deckzero.css`: base tokens, rhythm, and primitive styling
- `dist/deckzero.js`: authoring hint parser and slide hydrator
- `dist/themes/light.css`: light theme token override
- `demo/`: self-contained browser-runnable demo deck

## Authoring Contract

`deckzero` is HTML-first. The runtime reads normal Reveal-style HTML sections and applies layout hints plus heuristics to that HTML.

Use HTML comments inside a slide section:

```html
<!-- layout: split:text-image -->
<!-- accent: warning -->
```

Supported layout hints:

- `title`
- `statement`
- `split:text-text`
- `split:text-image`
- `split:image-text`
- `split:image-image`
- `split:text-image:vertical`
- `code-focus`
- `image-caption`
- `step`

Supported pane surface hints:

- `<!-- pane-surface: none -->`
  Removes the pane background fill for split layouts while keeping spacing and sizing.

Deck-wide branding can be configured on the `.reveal` root:

```html
<div
  class="reveal"
  data-dz-brand-src="assets/media/logo.svg"
  data-dz-brand-style="tag"
  data-dz-brand-position="bottom-left"
  data-dz-brand-alt="Acme"
>
```

- `data-dz-brand-src`: image URL for the brand asset
- `data-dz-brand-style`: `logo` or `tag`
- `data-dz-brand-position`: `top-left`, `top-right`, `bottom-left`, or `bottom-right`
- `data-dz-brand-alt`: optional accessible label for the image

Brandmark sizing and inset are controlled by tokens in `deckzero.css`:

```css
:root {
  --dz-brand-inset: clamp(1.5rem, 2.8vw, 2.25rem);
  --dz-brand-width: min(28vw, 15rem);
  --dz-brand-height: min(18vh, 8.5rem);
}
```

`logo` mode renders the asset directly. `tag` mode wraps it in a rounded, bordered treatment for badge-style branding.

For split layouts, use two major content blocks. A common pattern is:

```html
<section>
  <!-- layout: split:text-image -->
  <h2>How It Works</h2>
  <div>
    <p>Explain the idea.</p>
    <ul>
      <li>One</li>
      <li>Two</li>
    </ul>
  </div>
  <div>
    <img src="assets/media/default.svg" alt="Preview" />
  </div>
</section>
```

If a split slide omits heading or intro blocks and starts directly with the two panes, `deckzero` treats it as a full-canvas split and lets the panes occupy the full slide height.

If there is no explicit layout hint, `deckzero` applies simple heuristics:

- heading + paragraph => statement
- code block => code focus
- image + short caption => image caption
- fragments => step
- two top-level content blocks => split text-text

## Optional Markdown Compile Workflow

Markdown is supported as an authoring input, not as a runtime dependency. The supported workflow is:

1. Author a deck in markdown.
2. Preserve `deckzero` hints as HTML comments.
3. Run `npm run compile`.
4. Open the generated HTML deck as usual.

The markdown compiler emits standard deckzero-compatible `<section>` markup. HTML remains the canonical runtime input.

The markdown demo uses this flow:

- source: `demo-md-src/deck.md`
- output: `demo-md/index.html`

`npm run compile` creates a separate self-contained `demo-md/` folder so the hand-authored `demo/` deck remains unchanged and easy to compare against.

The compiler intentionally allows raw HTML blocks inside markdown for cases where structured slide markup is clearer than inventing a second hint language, especially split panes and custom controls.

## Theme Overrides

Theme files must only override tokens. Structure and primitive layout live in `deckzero.css`.

Example:

```html
<div class="reveal" data-dz-theme="light">
```

```html
<link rel="stylesheet" href="assets/deckzero/deckzero.css" />
<link rel="stylesheet" href="assets/deckzero/themes/light.css" />
<script src="assets/deckzero/deckzero.js"></script>
```

## Creating A New Theme

1. Copy `demo/` to a new `<theme>/` folder.
2. Create [`<theme>/assets/deckzero/themes/<theme>.css`](<theme>/assets/deckzero/themes/<theme>.css) with your custom token overrides.
3. Start from the light or dark theme and adjust branding-oriented tokens such as accent color, text color, background color, muted color, `--dz-font-sans`, and `--dz-font-mono`.
4. Update [`<theme>/index.html`](<theme>/index.html):
   1. Link to `assets/deckzero/themes/<theme>.css`.
   2. Set the default `.reveal` container to `data-dz-theme="<theme>"`.
   3. Add a theme toggle control that can switch between `dark`, `light`, and `<theme>`.
5. AI can help generate the initial theme tokens and also help assemble demo slides that fit the theme’s visual direction.

Example theme file:

```css
[data-dz-theme="<theme>"] {
  --dz-bg: #0b1020;
  --dz-fg: #f3f4f6;
  --dz-accent: #f97316;
  --dz-muted: #94a3b8;
  --dz-font-sans: "Avenir Next", "Segoe UI", sans-serif;
  --dz-font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

## Runtime

The browser bundle exposes `window.Deckzero` with:

- `apply(root)`
- `parseLayoutHint(value)`
- `inferLayout(section)`

The runtime auto-applies itself on `DOMContentLoaded`, and again on Reveal's `ready` and `slidechanged` events when Reveal is present.

## Demo

`deckzero/demo` remains the hand-authored HTML demo.

`deckzero/demo-md` is the generated markdown-backed comparison deck.

Recommended layout:

- `demo/index.html`
- `demo/assets/deckzero/`
- `demo/assets/deckzero/themes/`
- `demo/assets/reveal/`
- `demo/assets/reveal/plugin/`
- `demo/assets/media/`

The `demo` folder includes vendored Reveal runtime assets plus local media, so users do not need to download anything before opening it.

To rebuild the markdown demo after editing markdown:

- `npm run compile`

To load the demo:

- Browser: open `demo/index.html`
- GrandReveal: click `Open Deck` and choose `deckzero/demo` or `deckzero/demo/index.html`
