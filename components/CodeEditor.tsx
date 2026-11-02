"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { oneDark } from "@codemirror/theme-one-dark";
import { Lang } from "../lib/problems";

const extensionFor: Record<Lang, any> = {
  javascript: javascript(),
  python: python(),
  go: go(),
};

export default function CodeEditor({
  lang,
  value,
  onChange,
}: {
  lang: Lang;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="editor-wrap">
      <CodeMirror
        value={value}
        height="420px"
        theme={oneDark}
        extensions={[extensionFor[lang]]}
        onChange={(v) => onChange(v)}
        basicSetup={{ lineNumbers: true, tabSize: 2 }}
      />
    </div>
  );
}
