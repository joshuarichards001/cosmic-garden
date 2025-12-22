import { useCallback, useEffect, useRef } from 'react'

export function useCursorCentering(
    editorRef: React.RefObject<HTMLDivElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>
) {
    const isScrollingRef = useRef(false)
    const scrollTimeoutRef = useRef<number | null>(null)
    const centerTimeoutRef = useRef<number | null>(null)

    const centerCursor = useCallback(() => {
        if (centerTimeoutRef.current) {
            clearTimeout(centerTimeoutRef.current)
        }

        centerTimeoutRef.current = window.setTimeout(() => {
            centerTimeoutRef.current = null

            if (isScrollingRef.current || !containerRef.current || !editorRef.current) return

            const selection = window.getSelection()
            if (!selection || selection.rangeCount === 0) return

            const range = selection.getRangeAt(0)
            if (!editorRef.current.contains(range.commonAncestorContainer)) return

            const rects = range.getClientRects()
            const rect = rects.length > 0 ? rects[0] : range.getBoundingClientRect()
            if (!rect || rect.height === 0) return

            const container = containerRef.current
            const containerRect = container.getBoundingClientRect()
            const cursorY = rect.top - containerRect.top + container.scrollTop
            const targetScroll = cursorY - container.clientHeight / 2 + rect.height / 2

            container.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth',
            })
        }, 100)
    }, [containerRef, editorRef])

    const resumeCentering = useCallback(() => {
        isScrollingRef.current = false
        centerCursor()
    }, [centerCursor])

    useEffect(() => {
        const container = containerRef.current
        const editor = editorRef.current
        if (!container || !editor) return

        const handleScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            isScrollingRef.current = true
            scrollTimeoutRef.current = window.setTimeout(() => {
                scrollTimeoutRef.current = null
            }, 150)
        }

        const handleSelectionChange = () => {
            centerCursor()
        }

        const handleMouseDown = () => {
            resumeCentering()
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']
            if (navKeys.includes(e.key) || !e.key.startsWith('Arrow')) {
                resumeCentering()
            }
        }

        container.addEventListener('scroll', handleScroll, { passive: true })
        document.addEventListener('selectionchange', handleSelectionChange)
        editor.addEventListener('mousedown', handleMouseDown)
        editor.addEventListener('keydown', handleKeyDown)

        return () => {
            container.removeEventListener('scroll', handleScroll)
            document.removeEventListener('selectionchange', handleSelectionChange)
            editor.removeEventListener('mousedown', handleMouseDown)
            editor.removeEventListener('keydown', handleKeyDown)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            if (centerTimeoutRef.current) {
                clearTimeout(centerTimeoutRef.current)
            }
        }
    }, [containerRef, editorRef, centerCursor, resumeCentering])
}
