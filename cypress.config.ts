import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    // supportFile: 'cypress/support/e2e.ts',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
  // component: {
  //   devServer: {
  //     framework: 'next',
  //     bundler: 'webpack',
  //   },
  //   specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  //   supportFile: 'cypress/support/component.ts',
  // },
});
