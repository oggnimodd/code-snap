import type { ExportConfig } from "$lib/stores/editor.svelte";
import { toPng, toSvg, toJpeg } from "html-to-image";
import { toast } from "svelte-sonner";
import { editorStore } from "$lib/stores/editor.svelte";
import { EditorView } from "@codemirror/view";

// Reference : https://github.com/riccardoperra/codeimage/blob/d4bbea420273c74386a2f0f10fd9f42d1c6ac2eb/apps/codeimage/src/hooks/export-snippet.ts#L19

type InternalEditorView = EditorView & {
  viewState?: { printing: boolean };
  measure?(): void;
  requestMeasure?(): void;
};

export async function generateImageFromSnippet(options: ExportConfig) {
  // Set printing mode to force full rendering of CodeMirror
  const editorView = editorStore.editorView as InternalEditorView | null;
  if (editorView && editorView.viewState && editorView.measure) {
    editorView.viewState.printing = true;
    editorView.measure();
  }

  const element = document.getElementById("exportable-content");
  if (!element) {
    toast.error("Export failed: Element not found");
    console.error("Element not found");
    throw new Error("Element not found");
  }

  let imageDataUrl: string;
  try {
    switch (options.type) {
      case "png":
        imageDataUrl = await toPng(element, { pixelRatio: options.scale });
        break;
      case "svg":
        imageDataUrl = await toSvg(element, { pixelRatio: options.scale });
        break;
      case "jpeg":
        imageDataUrl = await toJpeg(element, { pixelRatio: options.scale });
        break;
      default:
        throw new Error(`Unsupported export type: ${options.type}`);
    }
  } catch (error) {
    toast.error("Image generation failed");
    console.error(error);
    throw error;
  } finally {
    if (editorView && editorView.viewState) {
      editorView.viewState.printing = false;
    }
    if (editorView && editorView.requestMeasure) {
      editorView.requestMeasure();
    }
  }
  return imageDataUrl;
}

export const downloadDataUrlAsImage = (
  dataUrl: string,
  options: ExportConfig
) => {
  const link = document.createElement("a");
  link.download = `my-code-snippet.${options.type}`;
  link.href = dataUrl;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
