import "@testing-library/jest-dom/vitest";

// Some components/utilities expect these browser APIs.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error - jsdom doesn't ship ResizeObserver
globalThis.ResizeObserver = ResizeObserver;

