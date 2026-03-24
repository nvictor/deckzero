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

## Card Collection

Use a shared card shell when the slide repeats the same conceptual unit several times.

<div class="dz-card-grid" data-dz-columns="3">
  <div class="dz-card fragment" data-fragment-index="1">
    <strong>Shared shell</strong>
    <small>Border, spacing, and surface come from deckzero instead of deck-local CSS.</small>
  </div>
  <div class="dz-card fragment" data-fragment-index="2">
    <strong>Responsive grid</strong>
    <small>Two-column, three-column, and auto-fit collections can all use the same primitive.</small>
  </div>
  <div class="dz-card fragment" data-fragment-index="3">
    <strong>Lower migration cost</strong>
    <small>Downstream decks only keep token overrides and truly unique visual exceptions.</small>
  </div>
</div>

---

## Tone Modifiers

Keep local meaning in the content while mapping visuals onto generic tones.

<div class="dz-card-grid" data-dz-columns="3">
  <div class="dz-card dz-tone-success fragment" data-fragment-index="1">
    <strong>Success</strong>
    <small>Useful for healthy states, ready paths, or low-risk conditions.</small>
  </div>
  <div class="dz-card dz-tone-warning fragment" data-fragment-index="2">
    <strong>Warning</strong>
    <small>Useful for investigate states, watch items, or medium-severity decisions.</small>
  </div>
  <div class="dz-card dz-tone-danger fragment" data-fragment-index="3">
    <strong>Danger</strong>
    <small>Useful for page-now states, critical paths, or high-risk conditions.</small>
  </div>
</div>

---

## Sequence Primitive

Use sequence nodes for journeys, reasoning chains, and staged rollouts.

<div class="dz-sequence" data-dz-columns="4">
  <article class="dz-sequence-node fragment" data-fragment-index="1">
    <span class="dz-step-badge">1</span>
    <strong>Observe</strong>
    <small>Start from the visible signal.</small>
  </article>
  <article class="dz-sequence-node fragment" data-fragment-index="2">
    <span class="dz-step-badge">2</span>
    <strong>Correlate</strong>
    <small>Line up logs, metrics, and deploy context.</small>
  </article>
  <article class="dz-sequence-node fragment dz-tone-warning" data-fragment-index="3">
    <span class="dz-step-badge">3</span>
    <strong>Decide</strong>
    <small>Pick the next investigation branch or remediation step.</small>
  </article>
  <article class="dz-sequence-node fragment dz-tone-success" data-fragment-index="4">
    <span class="dz-step-badge">4</span>
    <strong>Resolve</strong>
    <small>Publish the outcome and fold the learning back into the system.</small>
  </article>
</div>

---

<!-- accent: info -->
## Theme Overrides

Switch the deck between dark, light, and hulk without changing any layout classes.

<div class="theme-toggle">
  <button type="button" onclick="document.querySelector('.reveal').setAttribute('data-dz-theme', 'dark')">Dark</button>
  <button type="button" onclick="document.querySelector('.reveal').setAttribute('data-dz-theme', 'light')">Light</button>
  <button type="button" onclick="document.querySelector('.reveal').setAttribute('data-dz-theme', 'hulk')">Hulk</button>
</div>
