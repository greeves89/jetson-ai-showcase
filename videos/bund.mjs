import { bundle } from "@remotion/bundler";
import { ensureBrowser, selectComposition } from "@remotion/renderer";
import { readFileSync } from "node:fs";
import path from "node:path";

export async function vorbereiten(id) {
  await ensureBrowser();
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.jsx"), outDir: path.resolve("arbeit/bundle") });
  const comp = await selectComposition({ serveUrl, id });
  const plan = JSON.parse(readFileSync(`src/plan/${id}.json`, "utf8"));
  return { serveUrl, comp, plan };
}
