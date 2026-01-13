import { useCallback, useEffect, useRef } from "react";

export function useFileManager(
  editorRef: React.RefObject<HTMLDivElement | null>,
) {
  const hasUnsavedChanges = useRef(false);

  const save = useCallback(() => {
    if (!editorRef.current || editorRef.current.innerText.trim() === "") return;
    const blob = new Blob([editorRef.current.innerText], {
      type: "text/plain",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    hasUnsavedChanges.current = false;
  }, [editorRef]);

  const clear = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = "";
    editorRef.current.focus();
    hasUnsavedChanges.current = false;
  }, [editorRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [save]);

  useEffect(() => {
    const handleInput = () => {
      if (editorRef.current && editorRef.current.innerText.trim() !== "") {
        hasUnsavedChanges.current = true;
      } else {
        hasUnsavedChanges.current = false;
      }
    };
    const editor = editorRef.current;
    editor?.addEventListener("input", handleInput);
    return () => editor?.removeEventListener("input", handleInput);
  }, [editorRef]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return { save, clear };
}
