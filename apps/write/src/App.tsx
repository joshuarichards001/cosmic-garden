import '@repo/ui/styles.css'
import { useRef } from 'react'
import { useFileManager } from './useFileManager'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const { fileInputRef, save, importFile, handleFileChange, handleInput } = useFileManager(editorRef)

  return (
    <div className="h-full bg-writer-bg-light dark:bg-writer-bg-dark text-writer-text-light dark:text-writer-text-dark flex flex-col font-mono">
      <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
      <div className="flex-1 overflow-y-auto flex justify-center items-center">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="w-full max-w-[650px] outline-none text-base leading-[1.8] px-8 caret-writer-cursor"
          style={{
            minHeight: '1.5em',
          }}
        />
      </div>
      <footer className="flex gap-2 p-4 justify-start border-t border-writer-border-light dark:border-writer-border-dark">
        <button onClick={importFile} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
          Import
        </button>
        <button onClick={save} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
          Save
        </button>
      </footer>
    </div>
  )
}

export default App
