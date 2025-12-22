import '@repo/ui/styles.css'
import { useEffect, useRef } from 'react'
import { useCursorCentering } from './useCursorCentering'
import { useFileManager } from './useFileManager'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { save, clear } = useFileManager(editorRef)
  useCursorCentering(editorRef, containerRef)

  useEffect(() => {
    editorRef.current?.focus()
  }, [])

  return (
    <div className="h-full bg-writer-bg-light dark:bg-writer-bg-dark text-writer-text-light dark:text-writer-text-dark flex flex-col font-mono">
      <div ref={containerRef} className="flex-1 overflow-y-auto flex justify-center">
        <div
          ref={editorRef}
          contentEditable
          data-placeholder="Type out your thoughts here..."
          className="w-full max-w-[1000px] outline-none text-lg leading-[1.8] px-20 py-[50vh] self-start caret-writer-cursor empty:before:content-[attr(data-placeholder)] empty:before:text-writer-text-light/40 dark:empty:before:text-writer-text-dark/40"
          style={{
            minHeight: '1.5em',
          }}
        />
      </div>
      <footer className="flex gap-2 p-4 justify-start border-t border-writer-border-light dark:border-writer-border-dark">
        <button onClick={save} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
          Save
        </button>
        <button onClick={clear} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
          Clear
        </button>
      </footer>
    </div>
  )
}

export default App
