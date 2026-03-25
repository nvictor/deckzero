import path from "node:path";
import { fileURLToPath } from "node:url";

import { syncDemoAssets } from "../src/compiler/index.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

await syncDemoAssets(projectRoot);

console.log("Synced dist/ assets into demo/dist");
