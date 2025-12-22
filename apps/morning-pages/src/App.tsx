import { Button } from '@repo/ui/button'
import '@repo/ui/styles.css'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useFileManager } from './useFileManager'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [footerVisible, setFooterVisible] = useState(true)
  const [privateMode, setPrivateMode] = useState(false)
  const lastTabRef = useRef(0)
  const { save, clear } = useFileManager(editorRef)

  useEffect(() => {
    editorRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const now = Date.now()
      if (now - lastTabRef.current < 300) {
        setPrivateMode((prev) => !prev)
      }
      lastTabRef.current = now
      return
    }

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
    <div
      onMouseMove={() => setFooterVisible(true)}
      className={clsx(
        'h-full flex flex-col font-mono overflow-hidden',
        'bg-writer-bg-light dark:bg-writer-bg-dark',
        'text-writer-text-light dark:text-writer-text-dark'
      )}
    >
      <div
        className="flex-1 flex flex-col justify-end overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.7) 45%, black 50%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.7) 45%, black 50%, black 100%)',
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          onKeyDown={handleKeyDown}
          onInput={() => {
            const text = editorRef.current?.innerText || ''
            const words = text.trim().split(/\s+/).filter(Boolean)
            setWordCount(words.length)
            setFooterVisible(false)
          }}
          style={{
            fontFamily: privateMode ? "'Flow Circular', monospace" : 'inherit',
            fontSize: privateMode ? '1.4em' : undefined,
            letterSpacing: privateMode ? '0.02em' : undefined,
            lineHeight: privateMode ? '1.45' : undefined,
            transition: 'font-family 0.2s ease',
          }}
          data-placeholder="Type out your thoughts here..."
          className={clsx(
            'w-full max-w-[800px] outline-none',
            'text-lg leading-[1.8] px-8 pb-[45vh] mx-auto',
            'caret-writer-cursor',
            'empty:before:content-[attr(data-placeholder)]',
            'empty:before:text-writer-text-light/40 dark:empty:before:text-writer-text-dark/40'
          )}
        />
      </div>
      <footer
        className={clsx(
          'flex gap-2 p-4 justify-between',
          'border-t border-writer-border-light dark:border-writer-border-dark',
          'transition-opacity duration-300',
          footerVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex gap-2">
          <Button onClick={save} title="Ctrl/Cmd + s">Save</Button>
          <Button onClick={clear}>Clear</Button>
          <Button onClick={() => setPrivateMode((prev) => !prev)} title="Tab Tab">
            {privateMode ? 'Show' : 'Hide'}
          </Button>
        </div>
        <span className="text-sm self-center text-writer-text-light/60 dark:text-writer-text-dark/60">
          {wordCount} words
        </span>
      </footer>
    </div>
  )
}

export default App
