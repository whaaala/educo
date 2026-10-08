import fs from 'fs';
import path from 'path';

// E5d-8: one screen took SafeAreaView from 'react-native' (deprecated; it does nothing on Android, and its warning toast
// covered the tab bar in development). Every screen and component takes it from react-native-safe-area-context.
const files = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });

it('no file imports SafeAreaView from react-native', () => {
  const root = path.join(__dirname, '..');
  const bad = [...files(path.join(root, 'app')), ...files(path.join(root, 'components'))].filter((f) =>
    /import\s*\{[^}]*\bSafeAreaView\b[^}]*\}\s*from\s*['"]react-native['"]/.test(fs.readFileSync(f, 'utf8')));
  expect(bad.map((f) => path.relative(root, f))).toEqual([]);
});
