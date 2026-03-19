import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

globalThis.document = undefined;
globalThis.window = globalThis;

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const runtimePath = pathToFileURL(path.resolve(currentDir, "../dist/deckzero.js")).href;
await import(runtimePath);

const { Deckzero } = globalThis;

assert.equal(Deckzero.parseLayoutHint("title").primitive, "title");
assert.equal(Deckzero.parseLayoutHint("statement").primitive, "statement");
assert.deepEqual(Deckzero.parseLayoutHint("split:text-image:vertical"), {
  primitive: "split",
  orientation: "vertical",
  paneModes: ["text", "image"],
  raw: "split:text-image:vertical"
});

assert.deepEqual(Deckzero.parseLayoutHint("split:broken"), {
  primitive: "split",
  orientation: "horizontal",
  paneModes: ["text", "text"],
  raw: "split:broken"
});

assert.equal(Deckzero.parseBrandPosition("bottom left"), "bottom-left");
assert.equal(Deckzero.parseBrandPosition("tr"), "top-right");
assert.equal(Deckzero.parseBrandPosition("unknown"), "top-right");
assert.equal(Deckzero.parseBrandStyle("tag"), "tag");
assert.equal(Deckzero.parseBrandStyle("anything-else"), "logo");

console.log("deckzero runtime tests passed");
