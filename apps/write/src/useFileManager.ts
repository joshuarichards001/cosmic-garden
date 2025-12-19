import { useCallback, useEffect, useRef } from 'react'

const STORAGE_KEY = 'write-content'

export function useFileManager(editorRef: React.RefObject<HTMLDivElement | null>) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const save = useCallback(() => {
        if (!editorRef.current) return
        const blob = new Blob([editorRef.current.innerText], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'document.txt'
        a.click()
        URL.revokeObjectURL(a.href)
    }, [editorRef])

    const importFile = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editorRef.current) return
        file.text().then((text) => {
            editorRef.current!.innerText = text
            localStorage.setItem(STORAGE_KEY, editorRef.current!.innerHTML)
        })
        e.target.value = ''
    }, [editorRef])

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            localStorage.setItem(STORAGE_KEY, editorRef.current.innerHTML)
        }
    }, [editorRef])

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = localStorage.getItem(STORAGE_KEY) || ''
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault()
                    save()
                } else if (e.key === 'o') {
                    e.preventDefault()
                    importFile()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [save, importFile, editorRef])

    return {
        fileInputRef,
        save,
        importFile,
        handleFileChange,
        handleInput,
    }
}
