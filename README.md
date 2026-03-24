# deckzero

`deckzero` is an opinionated, CSS-first design system for Reveal.js-style presentations.

It provides:

- a minimal token layer
- a small set of slide layout primitives
- bundled themes plus themeable typography and surface tokens
- a tiny runtime that reads slide hints and applies auto-layout heuristics
- a markdown-first demo workflow that compiles to standard HTML

## Package Shape

- `dist/deckzero.css`: base tokens, rhythm, and primitive styling
- `dist/deckzero.js`: authoring hint parser and slide hydrator
- `dist/themes/light.css`: light theme token override
- `dist/themes/hulk.css`: hulk theme token override
- `src/compiler/`: markdown compiler and demo build helpers
- `demo/src/`: canonical markdown demo source
- `demo/vendor/`: vendored Reveal runtime assets used during demo builds
- `demo/dist/`: generated browser-runnable demo deck

## Package Consumption

`deckzero` can be consumed as a package directly from its repository.

Example:

```json
{
  "dependencies": {
    "deckzero": "github:nvictor/deckzero"
  }
}
```

Exposed package entry points:

- `deckzero`
- `deckzero/compiler`
- `deckzero/deckzero.css`
- `deckzero/deckzero.js`
- `deckzero/themes/light.css`
- `deckzero/themes/hulk.css`

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

These map onto the core layout primitives: `title`, `statement`, `split`, `code-focus`, `image-caption`, and `step`.

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

Theme files should primarily override tokens, while `deckzero.css` keeps the shared layout system. Bundled themes may also include small, theme-scoped surface overrides for panes and code blocks.

Theme selection example:

```html
<div class="reveal" data-dz-theme="light">
```

If you want to switch between bundled themes at runtime, load the optional theme stylesheets you plan to toggle to. The dark theme is already covered by the base tokens in `deckzero.css`.

```html
<link rel="stylesheet" href="assets/deckzero/deckzero.css" />
<link rel="stylesheet" href="assets/deckzero/themes/light.css" />
<link rel="stylesheet" href="assets/deckzero/themes/hulk.css" />
<script src="assets/deckzero/deckzero.js"></script>
```

The base stylesheet exposes extra themeable typography tokens:

```css
:root {
  --dz-heading: var(--dz-fg);
  --dz-emphasis: var(--dz-fg);
}
```

Themes can point those at `--dz-accent` when they want headings and inline emphasis to share the accent color.

The bundled themes currently use those tokens like this:

- `dark`: headings and emphasis inherit the dark foreground
- `light`: headings and emphasis inherit the light foreground
- `hulk`: headings and emphasis use the hulk accent `#16b61b`

## Creating A New Theme

1. Create or update `assets/deckzero/themes/<theme>.css` with your custom token overrides.
2. Adjust branding-oriented tokens such as accent color, heading color, emphasis color, text color, background color, muted color, `--dz-font-sans`, and `--dz-font-mono`.
3. Add scoped surface overrides only when the default pane or code treatments do not fit the theme.
4. Update `index.html`:
   1. Link to `assets/deckzero/themes/<theme>.css`.
   2. Set the default `.reveal` container to `data-dz-theme="<theme>"`.
   3. Add a theme toggle control that can switch between the bundled themes and `<theme>`.
5. Start from `light` if you want a bright theme, or from the base dark tokens in `deckzero.css` if you want a darker direction.

Example theme file:

```css
.reveal[data-dz-theme="<theme>"],
[data-dz-theme="<theme>"] .reveal {
  --dz-bg: #f8fafc;
  --dz-fg: #0f172a;
  --dz-accent: #f97316;
  --dz-muted: #94a3b8;
  --dz-heading: var(--dz-accent);
  --dz-emphasis: var(--dz-accent);
  --dz-font-sans: "Avenir Next", "Segoe UI", sans-serif;
  --dz-font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

### Hulk-style custom theme recipe

If you want a custom theme that behaves like `hulk`, start from the light-theme palette, point headings and inline emphasis at your accent, swap in your fonts, and set a default brandmark position on the `.reveal` root.

Example CSS:

```css
.reveal[data-dz-theme="gamma"],
[data-dz-theme="gamma"] .reveal {
  --dz-bg: #f8fafc;
  --dz-fg: #0f172a;
  --dz-accent: #7c3aed;
  --dz-muted: #64748b;
  --dz-heading: var(--dz-accent);
  --dz-emphasis: var(--dz-accent);
  --dz-font-sans: "Avenir Next", "Segoe UI", sans-serif;
  --dz-font-mono: "JetBrains Mono", ui-monospace, monospace;
  --dz-panel: rgba(255, 255, 255, 0.9);
  --dz-panel-muted: rgba(241, 245, 249, 0.9);
  --dz-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}
```

Example HTML defaults:

```html
<div
  class="reveal"
  data-dz-theme="gamma"
  data-dz-brand-src="assets/media/logo.svg"
  data-dz-brand-style="tag"
  data-dz-brand-position="bottom-left"
  data-dz-brand-alt="Gamma"
>
```

That setup gives you:

- a light-theme foundation
- accent-colored headers plus `b`, `strong`, and `em`
- custom sans and mono fonts
- a default brandmark placement without changing runtime code

Bundled themes now include:

- `dark` (default base tokens in `deckzero.css`)
- `light`
- `hulk` with light-theme foundations and accent `#16b61b`

The generated demo at `demo/dist/index.html` still defaults to `dark`; `light` and `hulk` are available via the theme toggle.

## Runtime

The browser bundle exposes `window.Deckzero` with:

- `apply(root)`
- `parseBrandPosition(value)`
- `parseBrandStyle(value)`
- `parseLayoutHint(value)`
- `inferLayout(section)`

The runtime auto-applies itself on `DOMContentLoaded`, and again on Reveal's `ready` and `slidechanged` events when Reveal is present.

## Scripts

- `npm run build-demo`: compile `demo/src/deck.md` into `demo/dist/index.html`, then sync runtime assets
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
