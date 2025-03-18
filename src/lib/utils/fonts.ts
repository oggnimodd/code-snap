import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS } from "$lib/config";

export function loadFonts() {
  // Map weight options to numeric values
  const weightMapping: Record<string, string> = {
    regular: "400",
    medium: "500",
    bold: "700",
    light: "300",
  };

  // Generate a comma-separated string of weights
  const weights = FONT_WEIGHT_OPTIONS.map(
    (opt) => weightMapping[opt.value]
  ).join(",");

  // Build the families string for Google Fonts
  // Replace spaces in font labels with '+' as required by Google Fonts
  const families = FONT_FAMILY_OPTIONS.map((option) => {
    const label = option.label.replace(/ /g, "+");
    return `${label}:${weights}`;
  }).join("|");

  // Create and inject the link element with crossorigin set to "anonymous"
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${families}`;
  link.crossOrigin = "anonymous"; // ensure the stylesheet is fetched with CORS enabled
  document.head.appendChild(link);
}
