import React from "react";
import { render } from "@testing-library/react-native";
import Chart from "../components/Chart/Chart";
import { createChartSpec, CHART_TYPES } from "@core/chart";

jest.mock("../contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

// Capture what the SVG parser receives, without needing the native parser in the test env.
// (jest.mock factories may only reference `mock`-prefixed outer variables, hence the name.)
const mockXml: { current: string } = { current: "" };
jest.mock("react-native-svg", () => {
  const R = require("react");
  return {
    __esModule: true,
    SvgXml: (props: { xml: string }) => {
      mockXml.current = props.xml;
      return R.createElement("SvgXml", props);
    },
  };
});

describe("mobile <Chart> — renders the shared core's SVG via react-native-svg", () => {
  it("renders every chart type without throwing and feeds SvgXml a real SVG", () => {
    for (const t of CHART_TYPES) {
      mockXml.current = "";
      const { UNSAFE_root } = render(<Chart spec={createChartSpec(t, { title: t })} width={300} />);
      expect(UNSAFE_root).toBeTruthy();
      // (Jest expect takes no message arg; the type is implicit in the loop.)
      expect(mockXml.current.startsWith("<svg")).toBe(true);
      expect(mockXml.current).toContain("viewBox=");
      expect(mockXml.current).not.toContain("NaN");
    }
  });

  it("passes the app theme through to the shared renderer", () => {
    mockXml.current = "";
    render(<Chart spec={createChartSpec("column")} width={300} theme="dark" />);
    const dark = mockXml.current;
    mockXml.current = "";
    render(<Chart spec={createChartSpec("column")} width={300} theme="light" />);
    expect(dark).not.toBe(mockXml.current);
  });

  it("exposes an accessible label", () => {
    const { getByLabelText } = render(<Chart spec={createChartSpec("pie", { title: "Marks" })} width={300} />);
    expect(getByLabelText("Chart: Marks")).toBeTruthy();
  });
});
