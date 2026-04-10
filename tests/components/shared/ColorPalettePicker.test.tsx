import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ColorGrid, isNativeColorPickerOpen } from "@/components/shared/ColorPalettePicker";

// ── Test suite ──

// Feature: ColorPalettePicker component rendering and interaction
describe("ColorPalettePicker", () => {
  // ────────────────────────────────────────────────
  // 1. ColorGrid rendering
  // ────────────────────────────────────────────────
  // Context: ColorGrid basic rendering and interaction
  describe("ColorGrid", () => {
    const colors = ["#000000", "#ff0000", "#00ff00", "#0000ff"];
    const onSelect = vi.fn();

    // Scenario: renders the correct number of color swatch buttons
    it("renders the correct number of color swatch buttons", () => {
      // Given a ColorGrid rendered with four colors
      const { container } = render(
        <ColorGrid colors={colors} onSelect={onSelect} />
      );
      // Then the number of buttons should match the number of colors
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBe(colors.length);
    });

    // Scenario: swatches have background style set
    it("renders swatches with background style set", () => {
      // Given a ColorGrid rendered with colors
      const { container } = render(
        <ColorGrid colors={colors} onSelect={onSelect} />
      );
      // Then each button should have a background style
      const buttons = container.querySelectorAll("button");
      buttons.forEach((btn) => {
        expect(btn.getAttribute("style")).toContain("background:");
      });
    });

    // Scenario: default swatch size is sm (w-6 h-6)
    it("applies sm swatch size by default (w-6 h-6)", () => {
      // Given a ColorGrid rendered with default swatch size
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={onSelect} />
      );
      // Then the button should have w-6 and h-6 classes
      const btn = container.querySelector("button");
      expect(btn).not.toBeNull();
      const classes = (btn!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("w-6");
      expect(classes).toContain("h-6");
    });

    // Scenario: md swatch size applies w-7 h-7
    it("applies md swatch size when specified (w-7 h-7)", () => {
      // Given a ColorGrid rendered with swatchSize="md"
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={onSelect} swatchSize="md" />
      );
      // Then the button should have w-7 and h-7 classes
      const btn = container.querySelector("button");
      expect(btn).not.toBeNull();
      const classes = (btn!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("w-7");
      expect(classes).toContain("h-7");
    });

    // Scenario: grid template columns match columns prop
    it("applies grid template columns based on columns prop", () => {
      // Given a ColorGrid rendered with columns=10
      const { container } = render(
        <ColorGrid colors={colors} onSelect={onSelect} columns={10} />
      );
      // Then the grid should have 10-column grid-template-columns style
      const grid = container.querySelector(".grid");
      expect(grid).not.toBeNull();
      expect(grid!.getAttribute("style")).toContain("grid-template-columns: repeat(10, 1fr)");
    });

    // Scenario: clicking a swatch calls onSelect with that color
    it("calls onSelect with the color when a swatch is clicked", () => {
      // Given a ColorGrid rendered with colors and a mock onSelect
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={colors} onSelect={fn} />
      );
      // When the second swatch is clicked
      const buttons = container.querySelectorAll("button");
      fireEvent.click(buttons[1]);
      // Then onSelect should be called with "#ff0000"
      expect(fn).toHaveBeenCalledWith("#ff0000");
    });

    // Scenario: selected color swatch has ring highlight
    it("highlights the selected color with ring classes", () => {
      // Given a ColorGrid rendered with selectedColor="#ff0000"
      const { container } = render(
        <ColorGrid colors={colors} selectedColor="#ff0000" onSelect={onSelect} />
      );
      // Then the matching swatch should have ring-2 and ring-blue-500
      const buttons = container.querySelectorAll("button");
      const selectedBtn = buttons[1];
      const classes = (selectedBtn.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("ring-2");
      expect(classes).toContain("ring-blue-500");
    });

    // Scenario: non-selected swatch has border but no ring
    it("non-selected swatch has border but no ring", () => {
      // Given a ColorGrid rendered with selectedColor="#ff0000"
      const { container } = render(
        <ColorGrid colors={colors} selectedColor="#ff0000" onSelect={onSelect} />
      );
      // Then a non-selected swatch should have border but no ring
      const buttons = container.querySelectorAll("button");
      const nonSelected = buttons[0]; // #000000, not selected
      const classes = (nonSelected.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("border-gray-200");
      expect(classes).not.toContain("ring-2");
    });

    // Scenario: swatches have expected interaction and transition classes
    it("swatches have rounded-md, cursor-pointer, hover:scale-110 classes", () => {
      // Given a ColorGrid rendered with a color
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={onSelect} />
      );
      // Then the swatch should have rounded, cursor, hover, and transition classes
      const btn = container.querySelector("button");
      const classes = (btn!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("rounded-md");
      expect(classes).toContain("cursor-pointer");
      expect(classes).toContain("hover:scale-110");
      expect(classes).toContain("transition-transform");
    });

    // Scenario: 'No fill' button renders when allowNoFill is true
    it("renders 'No fill' button when allowNoFill is true", () => {
      // Given a ColorGrid rendered with allowNoFill and an onNoFill callback
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={colors} onSelect={onSelect} allowNoFill onNoFill={fn} />
      );
      // Then a "No fill" button should be present
      const noFillBtn = container.querySelector('button[title="No fill"]');
      expect(noFillBtn).not.toBeNull();
      // When the "No fill" button is clicked
      fireEvent.click(noFillBtn!);
      // Then onNoFill should be called
      expect(fn).toHaveBeenCalled();
    });

    // Scenario: No fill button has ring when noFillSelected is true
    it("No fill button has ring when noFillSelected is true", () => {
      // Given a ColorGrid rendered with allowNoFill and noFillSelected
      const { container } = render(
        <ColorGrid colors={colors} onSelect={onSelect} allowNoFill noFillSelected onNoFill={() => {}} />
      );
      // Then the "No fill" button should have ring-2 and ring-blue-500
      const noFillBtn = container.querySelector('button[title="No fill"]');
      const classes = (noFillBtn!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("ring-2");
      expect(classes).toContain("ring-blue-500");
    });
  });

  // ────────────────────────────────────────────────
  // 2. CustomHexRow (rendered via ColorGrid showCustomHex)
  // ────────────────────────────────────────────────
  // Context: custom hex color input row
  describe("CustomHexRow (via showCustomHex)", () => {
    const onSelect = vi.fn();

    // Scenario: Custom label and hex input render when showCustomHex is true
    it("renders Custom label and hex input when showCustomHex is true", () => {
      // Given a ColorGrid rendered with showCustomHex and a selected color
      const { container, getByText } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#ff0000" onSelect={onSelect} showCustomHex />
      );
      // Then the "Custom" label should be present
      expect(getByText("Custom")).toBeTruthy();
      // And the hex input should show the selected color
      const hexInput = container.querySelector('input[type="text"]');
      expect(hexInput).not.toBeNull();
      expect((hexInput as HTMLInputElement).value).toBe("#ff0000");
    });

    // Scenario: Custom row does not render when showCustomHex is false
    it("does NOT render Custom row when showCustomHex is false", () => {
      // Given a ColorGrid rendered without showCustomHex
      const { container, queryByText } = render(
        <ColorGrid colors={["#000000"]} onSelect={onSelect} showCustomHex={false} />
      );
      // Then the "Custom" label and hex input should not be present
      expect(queryByText("Custom")).toBeNull();
      const hexInput = container.querySelector('input[type="text"]');
      expect(hexInput).toBeNull();
    });

    // Scenario: native color input renders for custom picker
    it("renders native color input for custom picker", () => {
      // Given a ColorGrid rendered with showCustomHex and a selected color
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#ff0000" onSelect={onSelect} showCustomHex />
      );
      // Then a native color input should be present with the selected color value
      const colorInput = container.querySelector('input[type="color"]');
      expect(colorInput).not.toBeNull();
      expect((colorInput as HTMLInputElement).value).toBe("#ff0000");
    });

    // Scenario: typing a valid hex in the input calls onSelect
    it("hex input allows typing and calls onSelect on valid hex", () => {
      // Given a ColorGrid rendered with showCustomHex and a mock onSelect
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={fn} showCustomHex />
      );
      // When a valid hex is typed into the input
      const hexInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      fireEvent.focus(hexInput);
      fireEvent.change(hexInput, { target: { value: "#abcdef" } });
      // Then onSelect should be called with the valid hex
      expect(fn).toHaveBeenCalledWith("#abcdef");
    });

    // Scenario: incomplete hex does not call onSelect
    it("hex input does NOT call onSelect on incomplete hex", () => {
      // Given a ColorGrid rendered with showCustomHex and a mock onSelect
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={fn} showCustomHex />
      );
      // When an incomplete hex is typed into the input
      const hexInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      fireEvent.focus(hexInput);
      fireEvent.change(hexInput, { target: { value: "#abc" } });
      // Then onSelect should not be called with the incomplete hex
      expect(fn).not.toHaveBeenCalledWith("#abc");
    });

    // Scenario: pressing Enter with a valid hex calls onSelect
    it("hex input calls onSelect on Enter key with valid hex", () => {
      // Given a ColorGrid rendered with showCustomHex and a mock onSelect
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={fn} showCustomHex />
      );
      // Given a valid hex is typed
      const hexInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      fireEvent.focus(hexInput);
      fireEvent.change(hexInput, { target: { value: "#aabbcc" } });
      fn.mockClear();
      // When Enter key is pressed
      fireEvent.keyDown(hexInput, { key: "Enter" });
      // Then onSelect should be called with the hex value
      expect(fn).toHaveBeenCalledWith("#aabbcc");
    });

    // Scenario: CustomHexRow container stops mousedown propagation
    it("CustomHexRow container stops mousedown propagation", () => {
      // Given a ColorGrid wrapped in a div with a mousedown handler
      const fn = vi.fn();
      const { container } = render(
        <div onMouseDown={fn}>
          <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={() => {}} showCustomHex />
        </div>
      );
      // When mousedown fires on the CustomHexRow
      const customRow = container.querySelector(".border-t.border-gray-100");
      expect(customRow).not.toBeNull();
      fireEvent.mouseDown(customRow!);
      // Then the parent's mousedown handler should NOT have been called
      expect(fn).not.toHaveBeenCalled();
    });

    // Scenario: hex input has proper styling classes
    it("hex input has proper styling classes", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={() => {}} showCustomHex />
      );
      // Then the hex input should have correct styling classes
      const hexInput = container.querySelector('input[type="text"]');
      const classes = (hexInput!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("font-mono");
      expect(classes).toContain("text-[11px]");
      expect(classes).toContain("rounded-md");
      expect(classes).toContain("focus:border-blue-400");
    });

    // Scenario: color swatch has rainbow gradient overlay
    it("color swatch has rainbow gradient overlay", () => {
      // Given a ColorGrid rendered with showCustomHex and a selected color
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#ff0000" onSelect={() => {}} showCustomHex />
      );
      // Then a div with conic-gradient style should be present
      const gradientDiv = container.querySelector('div[style*="conic-gradient"]');
      expect(gradientDiv).not.toBeNull();
    });
  });

  // ────────────────────────────────────────────────
  // 3. Native Color Picker Guard
  // ────────────────────────────────────────────────
  // Context: isNativeColorPickerOpen flag management
  describe("isNativeColorPickerOpen", () => {
    // Scenario: returns false by default
    it("returns false by default", () => {
      // Then isNativeColorPickerOpen should return false
      expect(isNativeColorPickerOpen()).toBe(false);
    });

    // Scenario: is exported as a function
    it("is exported as a function", () => {
      // Then isNativeColorPickerOpen should be a function
      expect(typeof isNativeColorPickerOpen).toBe("function");
    });

    // Scenario: becomes true when native color input receives mousedown
    it("becomes true when native color input receives mousedown", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={() => {}} showCustomHex />
      );
      // When mousedown fires on the native color input
      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.mouseDown(colorInput);
      // Then isNativeColorPickerOpen should return true
      expect(isNativeColorPickerOpen()).toBe(true);
      // Clean up: simulate blur to reset the flag
      fireEvent.blur(colorInput);
    });

    // Scenario: becomes true when native color input receives focus
    it("becomes true when native color input receives focus", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={() => {}} showCustomHex />
      );
      // When focus fires on the native color input
      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.focus(colorInput);
      // Then isNativeColorPickerOpen should return true
      expect(isNativeColorPickerOpen()).toBe(true);
      // Clean up
      fireEvent.blur(colorInput);
    });

    // Scenario: stays true during onChange while native picker is open
    it("stays true during onChange (while native picker is still open)", () => {
      // Given a ColorGrid rendered with showCustomHex and a mock onSelect
      const fn = vi.fn();
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={fn} showCustomHex />
      );
      // Given the native picker is opened via mousedown
      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.mouseDown(colorInput);
      expect(isNativeColorPickerOpen()).toBe(true);
      // When the user drags in native picker triggering onChange
      fireEvent.change(colorInput, { target: { value: "#ff0000" } });
      // Then the flag should STILL be true (picker is still open during drag)
      expect(isNativeColorPickerOpen()).toBe(true);
      // And onSelect should have been called with the new color
      expect(fn).toHaveBeenCalledWith("#ff0000");
      // Clean up
      fireEvent.blur(colorInput);
    });

    // Scenario: becomes false only on blur
    it("becomes false only on blur (native picker fully closed)", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} selectedColor="#000000" onSelect={() => {}} showCustomHex />
      );
      // Given the native picker is opened via mousedown
      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.mouseDown(colorInput);
      expect(isNativeColorPickerOpen()).toBe(true);
      // When blur fires on the native color input
      fireEvent.blur(colorInput);
      // Then isNativeColorPickerOpen should return false
      expect(isNativeColorPickerOpen()).toBe(false);
    });

    // Scenario: onSelect is called during native picker drag without closing
    it("onSelect is called during native picker drag without closing", () => {
      // Given a ColorGrid rendered with showCustomHex and a tracking onSelect
      const selectCalls: string[] = [];
      const { container } = render(
        <ColorGrid
          colors={["#000000"]}
          selectedColor="#000000"
          onSelect={(c) => { selectCalls.push(c); }}
          showCustomHex
        />
      );
      // Given the native picker is opened via mousedown
      const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement;
      fireEvent.mouseDown(colorInput);
      // When multiple drag changes fire
      fireEvent.change(colorInput, { target: { value: "#110000" } });
      fireEvent.change(colorInput, { target: { value: "#220000" } });
      fireEvent.change(colorInput, { target: { value: "#330000" } });
      // Then all colors should be reported via onSelect
      expect(selectCalls).toEqual(["#110000", "#220000", "#330000"]);
      // And the flag should still be true
      expect(isNativeColorPickerOpen()).toBe(true);
      // When the picker closes via blur
      fireEvent.blur(colorInput);
      // Then the flag should become false
      expect(isNativeColorPickerOpen()).toBe(false);
    });
  });

  // ────────────────────────────────────────────────
  // 4. UI & Look and Feel
  // ────────────────────────────────────────────────
  // Context: UI styling details and dark theme support
  describe("UI & look and feel", () => {
    // Scenario: grid uses gap-1 for swatch spacing
    it("grid uses gap-1 for swatch spacing", () => {
      // Given a ColorGrid rendered with colors
      const { container } = render(
        <ColorGrid colors={["#000000", "#ffffff"]} onSelect={() => {}} />
      );
      // Then the grid element should have gap-1 class
      const grid = container.querySelector(".grid");
      expect(grid).not.toBeNull();
      const classes = (grid!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("gap-1");
    });

    // Scenario: Custom row has border-t separator and proper spacing
    it("Custom row has border-t separator and proper spacing", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={() => {}} showCustomHex selectedColor="#000000" />
      );
      // Then the Custom row should have border-t separator and flex layout classes
      const customRow = container.querySelector(".border-t");
      expect(customRow).not.toBeNull();
      const classes = (customRow!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("mt-2");
      expect(classes).toContain("pt-2");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("gap-2");
    });

    // Scenario: Custom label has correct text styling
    it("Custom label has correct text styling", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { getByText } = render(
        <ColorGrid colors={["#000000"]} onSelect={() => {}} showCustomHex selectedColor="#000000" />
      );
      // Then the "Custom" label should have correct text styling classes
      const label = getByText("Custom");
      const classes = (label.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("text-[10px]");
      expect(classes).toContain("text-gray-400");
      expect(classes).toContain("dark:text-gray-500");
    });

    // Scenario: color swatch wrapper has shadow-inner and proper border
    it("color swatch wrapper has shadow-inner and proper border", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={() => {}} showCustomHex selectedColor="#000000" />
      );
      // Then the swatch wrapper should have shadow-inner and correct styling
      const swatch = container.querySelector(".shadow-inner");
      expect(swatch).not.toBeNull();
      const classes = (swatch!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("w-7");
      expect(classes).toContain("h-7");
      expect(classes).toContain("rounded-lg");
      expect(classes).toContain("border-gray-200");
      expect(classes).toContain("dark:border-gray-600");
    });

    // Scenario: hex input supports dark theme classes
    it("hex input supports dark theme classes", () => {
      // Given a ColorGrid rendered with showCustomHex
      const { container } = render(
        <ColorGrid colors={["#000000"]} onSelect={() => {}} showCustomHex selectedColor="#000000" />
      );
      // Then the hex input should have dark theme classes
      const hexInput = container.querySelector('input[type="text"]');
      const classes = (hexInput!.getAttribute("class") ?? "").split(/\s+/);
      expect(classes).toContain("dark:border-gray-600");
      expect(classes).toContain("dark:bg-[#1a1d24]");
      expect(classes).toContain("dark:text-gray-300");
    });
  });
});
