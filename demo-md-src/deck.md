<!-- layout: title -->
<p class="dz-eyebrow">Reveal.js design system</p>

# deckzero

Opinionated slide primitives, token-only themes, and compact authoring hints.

---

## Good defaults are the product

deckzero favors a tiny token set, a narrow primitive surface, and deterministic layout choices.

---

<!-- layout: split:text-image -->
## Split Layout

A single layout hint carries both orientation and pane semantics.

<div>
  <ul>
    <li>`split:text-image` gives structure without extra flags.</li>
    <li>Text panes inherit line length and rhythm rules.</li>
    <li>Image panes stretch media to the full card.</li>
  </ul>
</div>

<div>
  <img src="assets/media/default.svg" alt="Text to image split placeholder" />
</div>

---

<!-- layout: split:image-text:vertical -->
<!-- accent: warning -->
## Vertical Split

The same primitive supports a vertical orientation and accent mode.

<div>
  <img src="assets/media/default.svg" alt="Image pane placeholder" />
</div>

<div>
  <ul>
    <li>Orientation is encoded in the layout hint.</li>
    <li>Accent remains orthogonal and reusable.</li>
    <li>No structural theme overrides are required.</li>
  </ul>
</div>

---

<!-- layout: split:text-image -->
<div>
  <p class="dz-eyebrow">Headerless horizontal</p>
  <h3>Full-canvas split layout</h3>
  <p>When a split slide starts directly with its two panes, the layout now uses the full slide height instead of reserving a header band.</p>
</div>

<div>
  <img src="assets/media/default.svg" alt="Headerless horizontal split placeholder" />
</div>

---

<!-- layout: split:image-text:vertical -->
<div>
  <img src="assets/media/default.svg" alt="Headerless vertical split placeholder" />
</div>

<div>
  <p class="dz-eyebrow">Headerless vertical</p>
  <h3>Same primitive, full height</h3>
  <p>The vertical variant keeps the same authoring contract and stretches both panes to the available viewport.</p>
</div>

---

## Code Focus

```html
<section>
  <!-- layout: split:text-image -->
  <h2>How It Works</h2>
  <div>Text content</div>
  <div><img src="assets/media/default.svg" /></div>
</section>
```

The runtime infers code-focus when a slide is dominated by a code block.

---

![Hero image placeholder](assets/media/default.svg)

<p class="dz-caption">Image with a short caption falls into the image-caption primitive.</p>

---

<!-- layout: step -->
## Step Slide

<p class="fragment">Start from the base system.</p>
<p class="fragment">Add a small set of layouts.</p>
<p class="fragment">Let theme files override tokens only.</p>

---

## Auto Layout Heuristic

<div>
  <h3>Signal</h3>
  <p>Two major content blocks.</p>
</div>

<div>
  <h3>Default</h3>
  <p>`split:text-text` with shared spacing and card treatment.</p>
</div>

---

<!-- accent: info -->
## Theme Overrides

Switch the deck between dark and light without changing any layout classes.

<div class="theme-toggle">
  <button type="button" onclick="document.querySelector('.reveal').setAttribute('data-dz-theme', 'dark')">Dark</button>
  <button type="button" onclick="document.querySelector('.reveal').setAttribute('data-dz-theme', 'light')">Light</button>
</div>
