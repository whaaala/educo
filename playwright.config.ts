import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    // SLOW_MO=400 npm run test:watch:ui — paces a headed run so a person can follow what it is doing.
    // Zero by default, so a normal run is not slowed at all.
    launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 0) },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Desktop
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    // Tablet landscape
    {
      name: "tablet-landscape",
      use: {
        viewport: { width: 1024, height: 768 },
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },
    // Tablet portrait
    {
      name: "tablet-portrait",
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
      },
    },
    // Mobile
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
