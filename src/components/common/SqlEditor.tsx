"use client";

import { useEffect, useRef } from "react";
import AceEditor from "react-ace";

/* Importa o modo SQL e o tema */
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night";

/**
 * Props do editor.
 *
 * @param value          Texto SQL atual.
 * @param onChange       Callback disparado a cada alteração.
 * @param readOnly       Se o editor deve ser somente leitura.
 * @param height         Altura do editor (ex.: "300px").
 */
interface SqlEditorProps {
  /** Código SQL exibido no editor */
  value: string;
  /** Função chamada quando o usuário altera o conteúdo */
  onChange: (value: string) => void;
  /** Desabilita edição quando true */
  readOnly?: boolean;
  /** Altura do editor (padrão: 300px) */
  height?: string;
}

/**
 * Editor de SQL simples, responsivo e com destaque de sintaxe.
 *
 * Utiliza o tema claro `github` e o escuro `tomorrow_night`,
 * alternando automaticamente conforme a classe `dark` do HTML.
 */
export function SqlEditor({
  value,
  onChange,
  readOnly = false,
  height = "300px",
}: SqlEditorProps) {
  const editorRef = useRef<AceEditor>(null);

  // Ajusta o tema ao mudar entre modo claro/escuro
  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    const theme = isDark ? "tomorrow_night" : "github";
    editorRef.current?.editor.setTheme(`ace/theme/${theme}`);
  }, []);

  return (
    <AceEditor
      ref={editorRef}
      mode="sql"
      theme="github"
      name="sql-editor"
      width="100%"
      height={height}
      value={value}
      onChange={onChange}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        tabSize: 2,
      }}
      readOnly={readOnly}
    />
  );
}