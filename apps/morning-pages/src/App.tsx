import '@repo/ui/styles.css'
import { useEffect, useRef, useState } from 'react'
import { useFileManager } from './useFileManager'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [footerVisible, setFooterVisible] = useState(true)
  const { save, clear } = useFileManager(editorRef)

  useEffect(() => {
    editorRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const blockedKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'PageUp',
      'PageDown',
      'Delete',
    ]

    if (blockedKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div onMouseMove={() => setFooterVisible(true)} className="h-full bg-writer-bg-light dark:bg-writer-bg-dark text-writer-text-light dark:text-writer-text-dark flex flex-col font-mono overflow-hidden">
      <div className="flex-1 flex flex-col justify-end overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          onKeyDown={handleKeyDown}
          onInput={() => {
            const text = editorRef.current?.textContent || ''
            const words = text.trim().split(/\s+/).filter(Boolean)
            setWordCount(words.length)
            setFooterVisible(false)
          }}
          data-placeholder="Type out your thoughts here..."
          className="w-full max-w-[1000px] outline-none text-lg leading-[1.8] px-20 pb-[50vh] caret-writer-cursor empty:before:content-[attr(data-placeholder)] empty:before:text-writer-text-light/40 dark:empty:before:text-writer-text-dark/40"
        />
      </div>
      <footer className={`flex gap-2 p-4 justify-between border-t border-writer-border-light dark:border-writer-border-dark transition-opacity duration-300 ${footerVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex gap-2">
          <button onClick={save} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
            Save
          </button>
          <button onClick={clear} className="bg-writer-button-bg-light hover:bg-writer-button-bg-light-hover dark:bg-writer-button-bg-dark dark:hover:bg-writer-button-bg-dark-hover text-writer-button-text-light dark:text-writer-button-text-dark px-4 py-2 rounded text-sm">
            Clear
          </button>
        </div>
        <span className="text-sm self-center text-writer-text-light/60 dark:text-writer-text-dark/60">{wordCount} words</span>
      </footer>
    </div>
  )
}

export default App
