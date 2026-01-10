'use client'

import { useEffect, useRef } from 'react'

export default function CursorBlur() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number | null = null
    const trailElements: HTMLDivElement[] = []
    let lastTrailTime = 0
    const TRAIL_INTERVAL = 16 // ~60fps

    const createTrailElement = (x: number, y: number) => {
      const trail = document.createElement('div')
      trail.className = 'cursor-blur-trail'
      trail.style.left = `${x}px`
      trail.style.top = `${y}px`
      trail.style.opacity = '0.5'
      container.appendChild(trail)
      trailElements.push(trail)

      // Trigger fade out animation on next frame
      requestAnimationFrame(() => {
        trail.style.opacity = '0'
        trail.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      })

      // Remove element after animation completes
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail)
        }
        const index = trailElements.indexOf(trail)
        if (index > -1) {
          trailElements.splice(index, 1)
        }
      }, 800)
    }

    const updateCursorPosition = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        const now = Date.now()
        // Throttle trail creation for smooth performance
        if (now - lastTrailTime >= TRAIL_INTERVAL && trailElements.length < 20) {
          createTrailElement(e.clientX, e.clientY)
          lastTrailTime = now
        }
      })
    }

    const handleMouseLeave = () => {
      // Clear all trail elements when mouse leaves
      trailElements.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail)
        }
      })
      trailElements.length = 0
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }

    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      // Clean up all trail elements
      trailElements.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail)
        }
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="cursor-blur-container"
      aria-hidden="true"
    />
  )
}