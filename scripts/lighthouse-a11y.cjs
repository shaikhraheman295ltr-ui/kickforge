/**
 * QA harness: runs Lighthouse accessibility (opt. + best-practices/SEO) against
 * a local build and prints every failing node so fixes are actionable.
 *
 *   node scripts/lighthouse-a11y.cjs http://localhost:3200/ [out.json] [categories]
 *
 * The cookie header lets the harness through the auth gate — the gate checks
 * presence only, so any non-empty kf-auth is enough for instrumentation.
 */
const { writeFileSync } = require("fs");
const { resolve } = require("path");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/lighthouse-a11y.cjs <url> [outfile] [categories]");
  process.exit(1);
}
const outFile = process.argv[3];
const categories = process.argv[4]
  ? process.argv[4].split(",")
  : ["accessibility"];

(async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });
  try {
    const runLighthouse = require("lighthouse").default || require("lighthouse");
    const runnerResult = await runLighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: categories,
      formFactor: "desktop",
      screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      extraHeaders: { Cookie: "kf-auth=qa-harness" },
    });
    const report = runnerResult.lhr;
    if (outFile) writeFileSync(resolve(outFile), JSON.stringify(report, null, 2));

    console.log("URL:", report.requestedUrl);
    for (const [name, cat] of Object.entries(report.categories)) {
      console.log(`SCORE ${name}: ${(cat.score * 100).toFixed(0)}`);
    }

    let failed = 0;
    for (const audit of Object.values(report.audits)) {
      const important =
        audit.scoreDetails !== undefined ||
        (audit.score !== null && audit.score < 1 && !["manual", "notApplicable", "informative"].includes(audit.scoreDisplayMode));
      if (important && audit.score < 1) {
        failed++;
        const items = (audit.details && audit.details.items) || [];
        console.log(`\nFAIL ${audit.id} (${audit.title})`);
        if (audit.displayValue) console.log("  value:", audit.displayValue);
        items.slice(0, 8).forEach((it) => {
          const node = it.node;
          if (node) {
            console.log(`  - ${node.selector}`);
            const expl = String(node.explanation || "").split("\n").filter(Boolean);
            expl.slice(0, 2).forEach((l) => console.log(`    ${l.trim()}`));
          } else {
            console.log("  -", JSON.stringify(it).slice(0, 160));
          }
        });
        if (items.length > 8) console.log(`  ...and ${items.length - 8} more`);
      }
    }
    if (failed === 0) console.log("\nNo failed audits. Clean.");
    process.exit(failed === 0 ? 0 : 2);
  } finally {
    await chrome.kill();
  }
})();
