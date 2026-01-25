"use client"

import { useEffect, useState } from "react"

const MATRIX_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
const SENTENCES = [
  "Processing...",
  "Processing...",
  "Reviewing the most relevant data and context…",
  "Processing...",
  "Processing...",
  "Creating a new system. Analyzing patterns and connections…",
  "Processing...",
  "Processing...",
  "Almost ready. I will prepare the results now.",
]

export function MatrixLoader() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isRetracting, setIsRetracting] = useState(false)
  const [decoderPass, setDecoderPass] = useState(0)
  const [decoderPosition, setDecoderPosition] = useState(-1)
  const [glitchFrame, setGlitchFrame] = useState(0)

  const currentSentence = SENTENCES[currentSentenceIndex]

  // Glitch animation for trailing characters during typing
  useEffect(() => {
    if (!isRetracting && decoderPass === 0 && displayText.length > 0 && displayText.length < currentSentence.length) {
      const interval = setInterval(() => {
        setGlitchFrame((prev) => prev + 1)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [displayText.length, currentSentence.length, isRetracting, decoderPass])

  // Main animation flow
  useEffect(() => {
    // Typing phase
    if (!isRetracting && decoderPass === 0 && displayText.length < currentSentence.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentSentence.slice(0, displayText.length + 1))
      }, 30)
      return () => clearTimeout(timeout)
    }

    // Start decoder after typing completes
    if (!isRetracting && decoderPass === 0 && displayText.length === currentSentence.length) {
      const timeout = setTimeout(() => {
        setDecoderPass(1)
        setDecoderPosition(0)
      }, 300)
      return () => clearTimeout(timeout)
    }

    // Start retracting after decoder passes complete
    if (decoderPass === 4 && !isRetracting) {
      const timeout = setTimeout(() => {
        setIsRetracting(true)
      }, 500)
      return () => clearTimeout(timeout)
    }

    // Retracting phase
    if (isRetracting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, 20)
      return () => clearTimeout(timeout)
    }

    // Move to next sentence
    if (isRetracting && displayText.length === 0) {
      setIsRetracting(false)
      setDecoderPass(0)
      setDecoderPosition(-1)
      setCurrentSentenceIndex((prev) => (prev + 1) % SENTENCES.length)
    }
  }, [displayText, currentSentence, isRetracting, decoderPass])

  // Single decoder moving left to right
  useEffect(() => {
    if (decoderPass > 0 && decoderPass <= 3) {
      if (decoderPosition < displayText.length) {
        const timeout = setTimeout(() => {
          setDecoderPosition((prev) => prev + 1)
        }, 50)
        return () => clearTimeout(timeout)
      }

      // Decoder pass complete, start next pass or finish
      if (decoderPosition >= displayText.length) {
        const timeout = setTimeout(() => {
          setDecoderPass((prev) => prev + 1)
          setDecoderPosition(0)
        }, 200)
        return () => clearTimeout(timeout)
      }
    }
  }, [decoderPosition, decoderPass, displayText.length])

  const getCharAtPosition = (char: string, index: number) => {
    // Decoder animation - single position glitch left to right
    if (decoderPass > 0 && decoderPass <= 3 && index === decoderPosition) {
      return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    }

    // Trailing glitch during typing
    if (decoderPass === 0 && displayText.length < currentSentence.length) {
      const distanceFromEnd = displayText.length - 1 - index
      if (distanceFromEnd >= 0 && distanceFromEnd < 3) {
        if (Math.random() > 0.5) {
          return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        }
      }
    }

    return char
  }

  return (
    <div className="font-mono text-xs text-white whitespace-pre">
      {displayText.split("").map((char, index) => (
        <span key={`${currentSentenceIndex}-${index}-${glitchFrame}-${decoderPosition}`}>
          {getCharAtPosition(char, index)}
        </span>
      ))}
    </div>
  )
}
