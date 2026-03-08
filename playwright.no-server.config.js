import baseConfig from './playwright.config.js';

const noServerPort = process.env.PLAYWRIGHT_STATIC_PORT || '43174';

export default {
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: `http://127.0.0.1:${noServerPort}`
  },
  webServer: undefined
};
