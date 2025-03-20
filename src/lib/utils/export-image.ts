import type { ExportConfig } from "$lib/stores/editor.svelte";
import { toPng, toSvg, toJpeg } from "html-to-image";
import { toast } from "svelte-sonner";

export function generateImageFromSnippet(options: ExportConfig) {
  const element = document.getElementById("exportable-content");

  if (!element) {
    toast.error("Export failed: Element not found");
    console.error("Element not found");
    return;
  }

  let imagePromise: Promise<string>;

  switch (options.type) {
    case "png":
      imagePromise = toPng(element, { pixelRatio: options.scale });
      break;
    case "svg":
      imagePromise = toSvg(element, { pixelRatio: options.scale });
      break;
    case "jpeg":
      imagePromise = toJpeg(element, { pixelRatio: options.scale });
      break;
    default:
      throw new Error(`Unsupported export type: ${options.type}`);
  }

  return imagePromise;
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
