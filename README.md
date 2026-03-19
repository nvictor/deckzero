# deckzero

`deckzero` is an opinionated, CSS-first design system for Reveal.js-style presentations.

It provides:

- a minimal token layer
- six slide primitives
- token-only theme overrides
- a tiny runtime that reads slide hints and applies auto-layout heuristics

## Package Shape

- `dist/deckzero.css`: base tokens, rhythm, and primitive styling
- `dist/deckzero.js`: authoring hint parser and slide hydrator
- `dist/themes/light.css`: light theme token override
- `demo/`: self-contained browser-runnable demo deck

## Authoring Contract

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

If there is no explicit layout hint, `deckzero` applies simple heuristics:

- heading + paragraph => statement
- code block => code focus
- image + short caption => image caption
- fragments => step
- two top-level content blocks => split text-text

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

## Runtime

The browser bundle exposes `window.Deckzero` with:

- `apply(root)`
- `parseLayoutHint(value)`
- `inferLayout(section)`

The runtime auto-applies itself on `DOMContentLoaded`, and again on Reveal's `ready` and `slidechanged` events when Reveal is present.

## Demo

`deckzero/demo` is the only demo source of truth. It is intentionally self-contained so it can be opened directly in a browser or loaded as a folder deck in `GrandReveal`.

Recommended layout:

- `demo/index.html`
- `demo/assets/deckzero/`
- `demo/assets/deckzero/themes/`
- `demo/assets/reveal/`
- `demo/assets/reveal/plugin/`
- `demo/assets/media/`

The `demo` folder includes vendored Reveal runtime assets plus local media, so users do not need to download anything before opening it.

To load the demo:

- Browser: open `demo/index.html`
- GrandReveal: click `Open Deck` and choose `deckzero/demo` or `deckzero/demo/index.html`
