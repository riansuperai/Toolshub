// Vervangt " — " (spatie + em-dash + spatie) door ", " in alle bron- en
// content-bestanden. Beperkt tot geïnterpuncteerde tekst; laat losse "—"
// zonder omringende spaties met rust (bijv. code-tokens, uri's).
const fs = require("node:fs");
const path = require("node:path");

const ROOTS = ["src", "content"];
const EXT = new Set([".ts", ".tsx", ".css", ".md", ".json"]);
const EMDASH = "—";
const PATTERN = new RegExp(" " + EMDASH + " ", "g");

let filesChanged = 0;
let replacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!EXT.has(ext)) continue;
    const src = fs.readFileSync(full, "utf-8");
    if (!src.includes(EMDASH)) continue;
    const matches = src.match(PATTERN);
    if (!matches) continue;
    const out = src.replace(PATTERN, ", ");
    fs.writeFileSync(full, out, "utf-8");
    filesChanged++;
    replacements += matches.length;
    console.log(`  ${full}  (${matches.length})`);
  }
}

for (const r of ROOTS) if (fs.existsSync(r)) walk(r);
console.log(`\n${replacements} replacements across ${filesChanged} files`);
