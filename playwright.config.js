import { defineConfig } from '@playwright/test';
import path from 'node:path';

const PORT = Number.parseInt(process.env.PLAYWRIGHT_STATIC_PORT ?? '43173', 10);
const baseURL = `http://127.0.0.1:${PORT}`;
const executablePath = path.resolve('.playwright-browsers', 'local-chromium', 'google-chrome');

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  reporter: [['list']],
  outputDir: 'test-results',
  use: {
    baseURL,
    headless: true,
    launchOptions: {
      executablePath
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: `node ./scripts/start-static-server.mjs --port ${PORT} --root ./src`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 15_000
  }
});
