// Drives the Expo Router web build with Playwright: navigates a fixed list of
// routes, screenshots each, and reports any console/page errors.
//
// Usage: node .claude/skills/run-app/driver.mjs [baseUrl] [outDir]
//   baseUrl defaults to http://localhost:8090
//   outDir  defaults to /tmp/run-app-screenshots
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:8090';
const OUT = process.argv[3] ?? '/tmp/run-app-screenshots';

const ROUTES = [
  { path: '/(auth)/start', name: '01-start' },
  { path: '/onboarding/accent-select', name: '02-accent-select' },
  { path: '/(tabs)/home', name: '03-home' },
  { path: '/speaking', name: '04-speaking' },
  { path: '/(tabs)/report', name: '05-report' },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`[pageerror] ${err}`));

for (const route of ROUTES) {
  await page.goto(BASE + route.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // let Reanimated/first paint settle
  const file = `${OUT}/${route.name}.png`;
  await page.screenshot({ path: file });
  console.log(`captured ${route.name} <- ${route.path} -> ${file}`);
}

console.log('--- console/page errors ---');
console.log(errors.length ? errors.join('\n') : '(none)');

await browser.close();
process.exit(errors.length ? 1 : 0);
