// @vitest-environment jsdom
import { render, fireEvent } from "@testing-library/svelte";
import { flushSync } from "svelte";
import { describe, it, expect, vi } from "vitest";
import TestWrapper from "./ColorPickerTestWrapper.test.svelte";

describe("ColorPicker Component", () => {
  // Test initial render and preview box background style.
  it("renders with initial color and preview box", async () => {
    const { container } = render(TestWrapper, {
      props: {
        initialColor: "#ff0000",
      },
    });

    // Select the HEX input as the first text input.
    const hexInput = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    expect(hexInput.value).toBe("#ff0000");

    // Select the preview box by looking for an element with inline style matching the background.
    const previewBox = container.querySelector(
      "div[style*='background: #ff0000']"
    ) as HTMLDivElement;
    expect(previewBox).toBeTruthy();
  });

  // Test that typing a new HEX value updates the color.
  it("updates color when hex input changes", async () => {
    const onChangeMock = vi.fn((c: string) => {});
    const { container } = render(TestWrapper, {
      props: {
        initialColor: "#ff0000",
        onchange: onChangeMock,
      },
    });
    const hexInput = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    await fireEvent.input(hexInput, { target: { value: "#00ff00" } });
    flushSync();

    // The HEX input should update.
    expect(hexInput.value).toBe("#00ff00");
    // The onchange callback should be called with the new value.
    expect(onChangeMock).toHaveBeenCalledWith("#00ff00");
  });

  // Test updating via RGB inputs (setting to blue: #0000ff).
  it("updates color when RGB inputs change", async () => {
    const { container } = render(TestWrapper, {
      props: {
        initialColor: "#000000",
      },
    });
    // Retrieve all input elements; index 0 is HEX, then R, G, B, and A.
    const inputs = Array.from(
      container.querySelectorAll("input")
    ) as HTMLInputElement[];
    const hexInput = inputs[0];
    const rInput = inputs[1];
    const gInput = inputs[2];
    const bInput = inputs[3];

    // Set R and G to 0 and B to 255 to form blue.
    await fireEvent.input(rInput, { target: { value: "0" } });
    await fireEvent.input(gInput, { target: { value: "0" } });
    await fireEvent.input(bInput, { target: { value: "255" } });
    flushSync();

    // The HEX input should update to represent blue.
    expect(hexInput.value.toLowerCase()).toBe("#0000ff");
  });

  // Test interaction with the color canvas via mouse events.
  it("updates color on color canvas drag", async () => {
    const { container } = render(TestWrapper, {
      props: {
        initialColor: "#ff0000",
      },
    });
    const colorCanvas = container.querySelector(
      "canvas.cursor-crosshair"
    ) as HTMLCanvasElement;

    // Stub getBoundingClientRect so our simulated coordinates work as expected.
    colorCanvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Simulate a mousedown on the canvas at (50, 50), then move to (150, 150) and mouseup.
    await fireEvent.mouseDown(colorCanvas, { clientX: 50, clientY: 50 });
    await fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    await fireEvent.mouseUp(document);
    flushSync();

    // Retrieve the HEX input and verify its value has changed.
    const hexInput = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    expect(hexInput.value).not.toBe("#ff0000");
  });

  it("reflects external value changes", async () => {
    const { container, rerender } = render(TestWrapper, {
      props: {
        initialColor: "#ff0000",
        value: "#ff0000",
      },
    });
    const hexInput = container.querySelector(
      "input[type='text']"
    ) as HTMLInputElement;
    expect(hexInput.value).toBe("#ff0000");

    // Simulate an external update by re-rendering with a new value.
    await rerender({ value: "#123456" });
    flushSync();

    // The HEX input should now reflect the new external value.
    expect(hexInput.value).toBe("#123456");
  });
});
