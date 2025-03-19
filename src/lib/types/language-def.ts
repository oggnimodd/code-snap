import type { Extension } from "@codemirror/state";

export interface LanguageDefinition {
  readonly id: string;
  readonly label: string;
  readonly plugin: () => Promise<Extension>;
}
