// E5d-2: the setup key was spelled `setupFilesAfterSetup`, which Jest ignores, so these matchers never loaded.
it('loads the jest-native matchers through setupFilesAfterEnv', () => {
  const matchers = expect(null) as unknown as Record<string, unknown>;
  expect(typeof matchers.toHaveAccessibilityState).toBe('function');
});
