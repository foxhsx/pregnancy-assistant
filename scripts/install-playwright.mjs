import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const browserPath = path.resolve('.playwright-browsers');
const lockPath = path.join(browserPath, '__dirlock');
const localChromiumDir = path.join(browserPath, 'local-chromium');
const localChromePath = path.join(localChromiumDir, 'google-chrome');
const systemChromeCandidates = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
];
const systemChromePath = systemChromeCandidates.find((candidate) => existsSync(candidate));

if (existsSync(lockPath)) {
  rmSync(lockPath, { recursive: true, force: true });
  console.log(`Removed stale Playwright lock: ${lockPath}`);
}

if (!systemChromePath) {
  console.error('No supported system Chrome/Chromium binary found for project-scoped Playwright setup.');
  process.exit(1);
}

mkdirSync(localChromiumDir, { recursive: true });

if (existsSync(localChromePath)) {
  rmSync(localChromePath, { force: true });
}

symlinkSync(systemChromePath, localChromePath);
writeFileSync(
  path.join(localChromiumDir, 'INSTALLATION.txt'),
  [
    'Project-scoped Playwright browser setup',
    `Created: ${new Date().toISOString()}`,
    `System browser target: ${systemChromePath}`,
    `Project browser path: ${localChromePath}`
  ].join('\n') + '\n'
);
console.log(`Linked project-scoped browser: ${localChromePath} -> ${systemChromePath}`);
