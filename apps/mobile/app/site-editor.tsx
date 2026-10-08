import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { Spinner } from '../components/ui/Spinner';
import { useTheme } from '../contexts/ThemeContext';
import { useIsTablet } from '../hooks/useIsTablet';
import { editorUrl, FLUSH_ON_HIDE, ORIGIN_WHITELIST, routeNavigation } from '../lib/site-editor';

/**
 * The school's website builder, inside the app: a WebView over the web editor (rule 20). The editor lays itself out
 * by the window's width, so a phone gets the phone editor and a tablet the tablet one — `isTablet` only sizes our chrome.
 */
export default function SiteEditorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isTablet = useIsTablet();
  const { colors, theme } = useTheme();
  const webRef = useRef<WebView>(null);
  const canGoBack = useRef(false);
  // A new key mounts a new WebView: after the page's process is gone, and to switch between live and the saved copy.
  const [mount, setMount] = useState(0);
  const [offline, setOffline] = useState(false);

  // Android Back walks the editor's own history first, then leaves the screen (trap 8: never the app mid-edit).
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!canGoBack.current) return false;
        webRef.current?.goBack();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  // Leaving the app never tells the page it is hidden (measured on Android: no visibilitychange, no pagehide), so words still
  // waiting for a pause in typing were lost when the app was killed in the background (E5d-4). Say it for the WebView.
  // ponytail: on Android the command runs only when the app comes back (a hidden window draws no frame, measured) — there the
  // last ~1.4s of typing stays at risk of a kill (E5d-4, the user's decision); iOS goes 'inactive' while still drawn.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') webRef.current?.injectJavaScript(FLUSH_ON_HIDE);
    });
    return () => sub.remove();
  }, []);

  const remount = useCallback((asOffline: boolean) => {
    canGoBack.current = false;
    setOffline(asOffline);
    setMount((n) => n + 1);
  }, []);

  const headerHeight = isTablet ? 56 : 48;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top, height: headerHeight + insets.top, backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text, fontSize: isTablet ? 18 : 16 }]} accessibilityRole="header">
          Website builder
        </Text>
      </View>

      {offline && (
        <View
          style={[styles.notice, { backgroundColor: colors.warningLight, borderBottomColor: colors.border }]}
          accessibilityRole="alert"
        >
          <Ionicons name="cloud-offline-outline" size={18} color={colors.text} />
          <Text style={[styles.noticeText, { color: colors.text }]}>
            You are offline. This is the saved copy; your changes save on this device.
          </Text>
          <Pressable
            onPress={() => remount(false)}
            accessibilityRole="button"
            accessibilityLabel="Try again online"
            style={[styles.retry, { borderColor: colors.text }]}
          >
            <Text style={[styles.retryText, { color: colors.text }]}>Try again</Text>
          </Pressable>
        </View>
      )}

      <WebView
        key={mount}
        ref={webRef}
        testID="site-editor-webview"
        source={{ uri: editorUrl(theme) }}
        style={{ backgroundColor: colors.background }}
        startInLoadingState
        renderLoading={() => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}>
            <Spinner message="Opening the website builder…" />
          </View>
        )}
        // Offline: Android serves the copy it has cached (T6 — the native cache + the editor's own local save).
        cacheMode={offline ? 'LOAD_CACHE_ONLY' : 'LOAD_DEFAULT'}
        onError={() => {
          if (!offline) remount(true);
        }}
        onNavigationStateChange={(nav) => {
          canGoBack.current = nav.canGoBack;
        }}
        originWhitelist={ORIGIN_WHITELIST}
        onShouldStartLoadWithRequest={(req) => {
          if (req.isTopFrame === false) return true; // an embed inside the page (a video, a map)
          const where = routeNavigation(req.url);
          if (where.kind === 'native') router.push(where.path as never);
          if (where.kind === 'browser') void Linking.openURL(req.url);
          return where.kind === 'load';
        }}
        // The page's process can be killed to free memory (trap 4); the editor saved every change, so a fresh mount restores it.
        onRenderProcessGone={() => remount(offline)}
        onContentProcessDidTerminate={() => remount(offline)}
        // iOS: no edge swipe-back over a canvas whose handles reach the edge (trap 8); the header's Back leaves.
        allowsBackForwardNavigationGestures={false}
        webviewDebuggingEnabled={__DEV__}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_600SemiBold', marginLeft: 4 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  noticeText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  retry: { minHeight: 44, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, justifyContent: 'center' },
  retryText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
