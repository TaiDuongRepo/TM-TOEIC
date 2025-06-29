'use client'

import { useState, useEffect, ReactNode } from 'react'
import { FlashcardPopup } from './FlashcardPopup'

interface TextSelectionWrapperProps {
  children: ReactNode
  userId: string // For creating flashcards
}

export function TextSelectionWrapper({ children, userId }: TextSelectionWrapperProps) {
  const [selectedText, setSelectedText] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()
      
      if (text && text.length > 0) {
        setSelectedText(text)
        
        // Get selection position for popup placement
        const range = selection?.getRangeAt(0)
        if (range) {
          const rect = range.getBoundingClientRect()
          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          })
        }
        
        // Show popup after a short delay
        setTimeout(() => {
          setShowPopup(true)
        }, 100)
      }
    }

    const handleMouseDown = () => {
      // Hide popup when user starts a new selection
      if (showPopup) {
        setShowPopup(false)
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [showPopup])

  const handleSaveFlashcard = async (flashcard: {
    frontContent: string
    backContent: string
    imageUrl?: string
    audioUrl?: string
  }) => {
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          ...flashcard
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Flashcard created:', data.flashcard)
        
        // Show success message
        alert('Flashcard đã được tạo thành công!')
        
        // Clear selection
        window.getSelection()?.removeAllRanges()
      } else {
        const error = await response.json()
        console.error('Error creating flashcard:', error)
        alert('Lỗi khi tạo flashcard: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error creating flashcard:', error)
      alert('Lỗi khi tạo flashcard')
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedText('')
    // Clear text selection
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      {children}
      
      {/* Selection Indicator */}
      {selectedText && showPopup && (
        <div
          className="fixed z-50 bg-blue-500 text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{
            left: selectionPosition.x,
            top: selectionPosition.y,
            transform: 'translateX(-50%)'
          }}
        >
          Nhấn để thêm vào flashcard
        </div>
      )}

      {/* Flashcard Popup */}
      <FlashcardPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        selectedText={selectedText}
        onSave={handleSaveFlashcard}
      />
    </>
  )
}

