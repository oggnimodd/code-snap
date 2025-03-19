import {
  type LanguageSupport as LSupport,
  type StreamParser,
} from "@codemirror/language";
import type { LanguageDefinition } from "$lib/types/language-def";

const importLegacy = () =>
  import("@codemirror/language").then(({ LanguageSupport, StreamLanguage }) => {
    return function legacy(parser: StreamParser<unknown>): LSupport {
      return new LanguageSupport(StreamLanguage.define(parser));
    };
  });

export const SUPPORTED_LANGUAGES: readonly LanguageDefinition[] = [
  {
    id: "javascript",
    label: "Javascript",
    plugin: () =>
      import("@codemirror/lang-javascript").then(({ javascript }) =>
        javascript({ jsx: true })
      ),
  },
  {
    id: "typescript",
    label: "Typescript",
    plugin: () =>
      import("@codemirror/lang-javascript").then(({ javascript }) =>
        javascript({ jsx: true, typescript: true })
      ),
  },
  {
    id: "java",
    label: "Java",
    plugin: () => import("@codemirror/lang-java").then(({ java }) => java()),
  },
  {
    id: "kotlin",
    label: "Kotlin",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.kotlin)),
  },
  {
    id: "css",
    label: "Css",
    plugin: () => import("@codemirror/lang-css").then(({ css }) => css()),
  },
  {
    id: "less",
    label: "Less",
    plugin: () => import("@codemirror/lang-less").then(({ less }) => less()),
  },
  {
    id: "scss",
    label: "Scss",
    plugin: () =>
      import("@codemirror/lang-sass").then(({ sass }) =>
        sass({
          indented: false,
        })
      ),
  },
  {
    id: "csharp",
    label: "C#",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.csharp)),
  },
  {
    id: "html",
    label: "Html",
    plugin: () =>
      import("@codemirror/lang-html").then(({ html }) =>
        html({ matchClosingTags: true, autoCloseTags: true })
      ),
  },
  {
    id: "php",
    label: "PHP",
    plugin: () =>
      import("@codemirror/lang-php").then(({ php }) => php({ plain: true })),
  },
  {
    id: "python",
    label: "Python",
    plugin: () =>
      import("@codemirror/lang-python").then(({ python }) => python()),
  },
  {
    id: "markdown",
    label: "Markdown",
    plugin: () =>
      import("@codemirror/lang-markdown").then(({ markdown }) => markdown()),
  },
  {
    id: "rust",
    label: "Rust",
    plugin: () => import("@codemirror/lang-rust").then(({ rust }) => rust()),
  },
  {
    id: "cpp",
    label: "C++",
    plugin: () => import("@codemirror/lang-cpp").then(({ cpp }) => cpp()),
  },
  {
    id: "c",
    label: "C",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.c)),
  },
  {
    id: "xml",
    label: "XML",
    plugin: () => import("@codemirror/lang-xml").then(({ xml }) => xml()),
  },
  {
    id: "ruby",
    label: "Ruby",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/ruby"),
      ]).then(([cb, m]) => cb(m.ruby)),
  },
  {
    id: "visual-basic",
    label: "Visual Basic",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/vb"),
      ]).then(([cb, m]) => cb(m.vb)),
  },
  {
    id: "plain-text",
    label: "Plain Text",
    plugin: () => Promise.resolve([]),
  },
  {
    id: "json",
    label: "JSON",
    plugin: () => import("@codemirror/lang-json").then(({ json }) => json()),
  },
  {
    id: "sql",
    label: "SQL",
    plugin: () => import("@codemirror/lang-sql").then(({ sql }) => sql()),
  },
  {
    id: "shell",
    label: "Shell",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/shell"),
      ]).then(([cb, m]) => cb(m.shell)),
  },
  {
    id: "swift",
    label: "Swift",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/swift"),
      ]).then(([cb, m]) => cb(m.swift)),
  },
  {
    id: "dockerfile",
    label: "Dockerfile",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/dockerfile"),
      ]).then(([cb, m]) => cb(m.dockerFile)),
  },
  {
    id: "dart",
    label: "Dart",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.dart)),
  },
  {
    id: "scala",
    label: "Scala",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.scala)),
  },
  {
    id: "yaml",
    label: "Yaml",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/yaml"),
      ]).then(([cb, m]) => cb(m.yaml)),
  },
  {
    id: "go",
    label: "Go",
    plugin: () => import("@codemirror/lang-go").then(({ go }) => go()),
  },
  {
    id: "protobuf",
    label: "Protobuf",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/protobuf"),
      ]).then(([cb, m]) => cb(m.protobuf)),
  },
  {
    id: "pascal",
    label: "Pascal",
    plugin: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/pascal"),
      ]).then(([cb, m]) => cb(m.pascal)),
  },
];
