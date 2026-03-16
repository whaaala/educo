import path from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(__dirname, "test/setup.ts")],
    css: true,
    exclude: ["**/node_modules/**", "**/e2e/**", "**/*.spec.ts"],
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // ── Prevent "Timeout calling onTaskUpdate" birpc errors ──
    // Use forked processes (not threads) for better memory isolation.
    // Each large test file (e.g. DocEditor 200+ tests) gets its own process,
    // preventing serialization backpressure on the RPC channel.
    pool: "forks",
    poolOptions: {
      forks: {
        // Limit concurrent forks to avoid overwhelming the RPC channel
        // when multiple large test files run simultaneously.
        maxForks: 3,
        minForks: 1,
      },
    },

    // Give large test files enough time to complete all hooks and teardown.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    teardownTimeout: 30_000,

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "**/*.d.ts",
        "**/*.config.*",
        "**/node_modules/**",
        "**/.next/**",
        "apps/**",
        "test/**",
        "tests/**",
      ],
    },
  },
});

