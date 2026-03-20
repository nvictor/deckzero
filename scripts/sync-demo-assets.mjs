import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const distDir = path.join(projectRoot, "dist");
const targets = [
  path.join(projectRoot, "demo", "assets", "deckzero"),
  path.join(projectRoot, "demo-md", "assets", "deckzero"),
];

for (const target of targets) {
  await fs.mkdir(target, { recursive: true });
  await fs.cp(distDir, target, { recursive: true });
}

console.log("Synced dist/ assets into demo and demo-md");
