import type { Extension } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { history, historyKeymap } from "@codemirror/commands";
import { defaultKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";

import { editorTheme } from "./theme";
import { markdownKeymap } from "./keymap";

export function createExtensions(options: {
  onChange: (value: string) => void;
  placeholder?: string;
}): Extension[] {
  return [
    // Core
    history(),
    EditorView.lineWrapping,
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

    // Markdown language
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
    }),

    // Theme
    editorTheme,

    // Placeholder
    ...(options.placeholder ? [placeholder(options.placeholder)] : []),

    // Keymap
    keymap.of([...markdownKeymap, ...defaultKeymap, ...historyKeymap]),

    // Change listener
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        options.onChange(update.state.doc.toString());
      }
    }),
  ];
}
