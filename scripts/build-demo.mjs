import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemo, clearDemoDist, syncDemoAssets } from "../src/compiler/index.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

await clearDemoDist(projectRoot);
await buildDemo(projectRoot);
await syncDemoAssets(projectRoot);

console.log("Built demo/dist from demo/src/deck.md");
