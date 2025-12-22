import { useRef, useState } from 'react'

const toDots = (text: string) => text.replace(/[a-zA-Z0-9]/g, '•')

function moveCursorToEnd(el: HTMLElement) {
    if (el.childNodes.length === 0) return
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
}

export function usePrivateMode(editorRef: React.RefObject<HTMLDivElement | null>) {
    const [privateMode, setPrivateMode] = useState(false)
    const lastTabRef = useRef(0)
    const realTextRef = useRef('')

    const toggle = () => {
        setPrivateMode((prev) => {
            const next = !prev
            const el = editorRef.current
            if (el) {
                el.textContent = next ? toDots(realTextRef.current) : realTextRef.current
                moveCursorToEnd(el)
            }
            return next
        })
    }

    const handleDoubleTap = (e: React.KeyboardEvent) => {
        if (e.key !== 'Tab') return false
        e.preventDefault()
        const now = Date.now()
        if (now - lastTabRef.current < 300) toggle()
        lastTabRef.current = now
        return true
    }

    const handleInput = () => {
        const el = editorRef.current
        if (!el) return

        const currentDisplay = el.textContent || ''

        if (privateMode) {
            const prevLen = realTextRef.current.length
            const currLen = currentDisplay.length

            if (currLen > prevLen) {
                // Characters were added - find what was typed by looking at non-dot chars
                const typed = currentDisplay.slice(prevLen)
                realTextRef.current += typed.replace(/•/g, '')
            } else if (currLen < prevLen) {
                // Characters were deleted
                realTextRef.current = realTextRef.current.slice(0, currLen)
            }

            el.textContent = toDots(realTextRef.current)
            moveCursorToEnd(el)
        } else {
            realTextRef.current = currentDisplay
        }
    }

    const getRealText = () => realTextRef.current

    return { privateMode, toggle, handleDoubleTap, handleInput, getRealText }
}
