/**
 * Chart (mobile) — the React Native renderer for the reusable chart system.
 *
 * It does NOT re-implement any chart drawing. It calls `chartToSvgString` from the shared core
 * (repo-root `lib/chart`, imported here as `@core/chart` via the Metro alias) — the SAME pure
 * renderer the work-document embeds and exports use — and hands the resulting SVG to
 * react-native-svg's <SvgXml>. So a chart looks identical on web and native, from one code path.
 *
 *   import Chart from "@/components/Chart/Chart";
 *   <Chart spec={createChartSpec("donut", { title: "Attendance" })} />
 */

import React from "react";
import { View, useWindowDimensions, type StyleProp, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { chartToSvgString, type ChartSpec, type ChartThemeName } from "@core/chart";
import { useTheme, type ThemeMode } from "../../contexts/ThemeContext";

export interface ChartProps {
  spec: ChartSpec;
  /** Rendered width in px. Defaults to the container/screen width (minus a small margin). */
  width?: number;
  /** width / height. Defaults to 1.6 (matches the web/embed default). */
  aspect?: number;
  /** Override the surface theme; defaults to the app theme. */
  theme?: ChartThemeName;
  style?: StyleProp<ViewStyle>;
}

const toChartTheme = (mode: ThemeMode): ChartThemeName =>
  mode === "dark" || mode === "midnight" || mode === "purple" ? mode : "light";

function ChartBase({ spec, width, aspect = 1.6, theme, style }: ChartProps) {
  const { theme: appTheme } = useTheme();
  const { width: screenW } = useWindowDimensions();

  const w = Math.max(80, width ?? screenW - 32);
  const h = Math.round(w / Math.max(0.3, aspect));
  const surface = theme ?? toChartTheme(appTheme);

  // One shared renderer → one SVG string → parsed by react-native-svg.
  const xml = React.useMemo(
    () => chartToSvgString(spec, { theme: surface, aspect, uid: `m-${spec.chartType}` }),
    [spec, surface, aspect],
  );

  return (
    <View style={[{ width: w, height: h }, style]} accessibilityRole="image"
      accessibilityLabel={spec.title ? `Chart: ${spec.title}` : `${spec.chartType} chart`}>
      <SvgXml xml={xml} width="100%" height="100%" />
    </View>
  );
}

const Chart = React.memo(ChartBase);
export default Chart;
