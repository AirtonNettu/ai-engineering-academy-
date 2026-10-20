import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
export const highlighter = createHighlighterCore({
  themes: [import('shiki/themes/github-dark.mjs')],
  langs: [
    import('shiki/langs/python.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/bash.mjs'),
  ],
  engine: createJavaScriptRegexEngine(),
});
