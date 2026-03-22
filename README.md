# deckzero

`deckzero` is an opinionated, CSS-first design system for Reveal.js-style presentations.

It provides:

- a minimal token layer
- six slide primitives
- token-only theme overrides
- a tiny runtime that reads slide hints and applies auto-layout heuristics
- a markdown-first demo workflow that compiles to standard HTML

## Package Shape

- `dist/deckzero.css`: base tokens, rhythm, and primitive styling
- `dist/deckzero.js`: authoring hint parser and slide hydrator
- `dist/themes/light.css`: light theme token override
- `src/compiler/`: markdown compiler and demo build helpers
- `demo/src/`: canonical markdown demo source
- `demo/vendor/`: vendored Reveal runtime assets used during demo builds
- `demo/dist/`: generated browser-runnable demo deck

## Authoring Contract

`deckzero` remains HTML-based at runtime, but the recommended authoring flow is markdown-first.

The compiler turns markdown into normal Reveal-style `<section>` markup, and the browser only consumes the generated HTML.

Recommended workflow:

1. Edit `demo/src/deck.md`.
2. Preserve `deckzero` hints as HTML comments.
3. Run `npm run build-demo`.
4. Open `demo/dist/index.html`.

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

## Styling Primitives

Alongside the slide layouts, `deckzero` also provides low-level styling primitives for repeated within-slide structures.

### Card collection

Use `.dz-card-grid` for repeated card collections:

```html
<div class="dz-card-grid" data-dz-columns="3">
  <div class="dz-card">
    <strong>One</strong>
    <small>Shared shell styling.</small>
  </div>
</div>
```

Supported column hints:

- `data-dz-columns="2"`
- `data-dz-columns="3"`
- `data-dz-columns="4"`
- `data-dz-columns="5"`
- omit the attribute for auto-fit card wrapping

### Card shell

Use `.dz-card` for bordered, compact panel content that repeats across a slide.

The shell provides shared padding, radius, surface treatment, and heading rhythm so deck-local CSS does not need to recreate the same panel pattern.

### Tone modifiers

Use tone classes to map local meaning onto generic visual treatments:

- `.dz-tone-neutral`
- `.dz-tone-info`
- `.dz-tone-success`
- `.dz-tone-warning`
- `.dz-tone-danger`

These work on `.dz-card` and `.dz-sequence-node`.

### Sequence primitive

Use `.dz-sequence` and `.dz-sequence-node` for ordered journeys, reasoning chains, or staged workflows:

```html
<div class="dz-sequence" data-dz-columns="4">
  <article class="dz-sequence-node dz-tone-warning">
    <span class="dz-step-badge">3</span>
    <strong>Decide</strong>
    <small>Pick the next branch.</small>
  </article>
</div>
```

`sequence` is intentionally generic enough to cover step chips, numbered paths, and investigation flows without shipping domain-specific class names.

## Markdown Compiler

The compiler intentionally allows raw HTML blocks inside markdown for cases where structured slide markup is clearer than inventing a second hint language, especially split panes and custom controls.

Current demo layout:

- source markdown: `demo/src/deck.md`
- source media: `demo/src/assets/media/`
- vendored Reveal assets: `demo/vendor/reveal/`
- generated output: `demo/dist/`

Compiler code lives in `src/compiler/`, while `scripts/` only provides thin command-line entry points.

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

## Scripts

- `npm run build-demo`: compile `demo/src/deck.md` into `demo/dist/index.html` and sync runtime assets
- `npm run compile`: alias for `npm run build-demo`
- `npm run sync-demo-assets`: copy `dist/` into `demo/dist/assets/deckzero`
- `npm test`: run runtime and compiler tests

## Demo

The demo output includes vendored Reveal runtime assets plus local media, so users do not need to download anything before opening it.

To rebuild the demo:

- `npm run build-demo`

To load the demo:

- Browser: open `demo/dist/index.html`
- GrandReveal: click `Open Deck` and choose `deckzero/demo/dist` or `deckzero/demo/dist/index.html`
