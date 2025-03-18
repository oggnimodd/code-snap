import { toPng } from "html-to-image";

export function exportToPng() {
  const element = document.getElementById("exportable-content");

  if (element) {
    // Use pixelRatio: 3 to scale the output image 3 times
    toPng(element, { pixelRatio: 3 })
      .then(function (dataUrl) {
        // Create a download link
        const link = document.createElement("a");
        link.download = "my-code-snippet.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("Error exporting to PNG:", error);
      });
  }
}
