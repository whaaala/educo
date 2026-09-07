import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  /**
   * A test may outlast a first navigation to a heavy route.
   *
   * These suites run against `next dev`, which compiles a route the first time it is asked for: the builder
   * page takes ~35s cold and ~5s warm. With the 30s default, the FIRST test to reach a route fails and every
   * one after it passes — which reads exactly like a flaky assertion and is not one. It bit twice: once in a
   * new spec, and once when a whole chain ran under contention and a band test that normally takes 8.3s went
   * past 30s.
   *
   * Raised here rather than in each spec because it is a fact about the app, not about any one test — twelve
   * navigations across seven files share it. A test that hangs for a real reason still fails, just later.
   */
  timeout: 120 * 1000,
  expect: { timeout: 10 * 1000 }, // an ASSERTION still has to settle quickly; only navigation gets the long budget
  use: {
    baseURL: "http://localhost:3000",
    navigationTimeout: 90 * 1000,
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
