import { useCallback, useEffect } from 'react'

const STORAGE_KEY = 'write-content'

export function useFileManager(
    editorRef: React.RefObject<HTMLDivElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>,
) {
    const save = useCallback(() => {
        if (!editorRef.current) return
        const blob = new Blob([editorRef.current.innerText], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${new Date().toISOString().split('T')[0]}.md`
        a.click()
        URL.revokeObjectURL(a.href)
    }, [editorRef])

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            localStorage.setItem(STORAGE_KEY, editorRef.current.innerHTML)
        }
    }, [editorRef])

    const clear = useCallback(() => {
        if (!editorRef.current) return
        editorRef.current.innerHTML = ''
        localStorage.setItem(STORAGE_KEY, '')
        editorRef.current.focus()
    }, [editorRef])

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = localStorage.getItem(STORAGE_KEY) || ''
            // Move cursor to end and scroll to bottom on initial load
            const range = document.createRange()
            const sel = window.getSelection()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(range)
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault()
                    save()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [save, editorRef, containerRef])

    return {
        save,
        handleInput,
        clear,
    }
}
