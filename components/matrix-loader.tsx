"use client"

import { useEffect, useState } from "react"

const MATRIX_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
const SPINNER_FRAMES = ["▖", "▘", "▝", "▗"]

const SENTENCES = [
  "Initializing inference engine…",
  "Scanning context for relevant signals…",
  "k=4 memory chunks retrieved…",
  "Mapping semantic relationships across tokens…",
  "Decomposing task into subtasks…",
  "Running tool calls in parallel…",
  "Evaluating response strategies…",
  "Cross-referencing prior context…",
  "Synthesis pass complete…",
  "Verifying reasoning chain…",
  "Output ready.",
]

export function MatrixLoader() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isRetracting, setIsRetracting] = useState(false)
  const [decoderPass, setDecoderPass] = useState(0)
  const [decoderPosition, setDecoderPosition] = useState(-1)
  const [glitchFrame, setGlitchFrame] = useState(0)
  const [spinnerFrame, setSpinnerFrame] = useState(0)

  const currentSentence = SENTENCES[currentSentenceIndex]

  // Spinner — always ticking
  useEffect(() => {
    const interval = setInterval(() => setSpinnerFrame(f => f + 1), 120)
    return () => clearInterval(interval)
  }, [])

  // Glitch during typing
  useEffect(() => {
    if (!isRetracting && decoderPass === 0 && displayText.length > 0 && displayText.length < currentSentence.length) {
      const interval = setInterval(() => setGlitchFrame(f => f + 1), 50)
      return () => clearInterval(interval)
    }
  }, [displayText.length, currentSentence.length, isRetracting, decoderPass])

  // Main animation flow
  useEffect(() => {
    if (!isRetracting && decoderPass === 0 && displayText.length < currentSentence.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentSentence.slice(0, displayText.length + 1))
      }, 30)
      return () => clearTimeout(timeout)
    }

    if (!isRetracting && decoderPass === 0 && displayText.length === currentSentence.length) {
      const timeout = setTimeout(() => {
        setDecoderPass(1)
        setDecoderPosition(0)
      }, 300)
      return () => clearTimeout(timeout)
    }

    if (decoderPass === 4 && !isRetracting) {
      const timeout = setTimeout(() => setIsRetracting(true), 500)
      return () => clearTimeout(timeout)
    }

    if (isRetracting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, 20)
      return () => clearTimeout(timeout)
    }

    if (isRetracting && displayText.length === 0) {
      setIsRetracting(false)
      setDecoderPass(0)
      setDecoderPosition(-1)
      setCurrentSentenceIndex(prev => (prev + 1) % SENTENCES.length)
    }
  }, [displayText, currentSentence, isRetracting, decoderPass])

  // Decoder passes left to right
  useEffect(() => {
    if (decoderPass > 0 && decoderPass <= 3) {
      if (decoderPosition < displayText.length) {
        const timeout = setTimeout(() => setDecoderPosition(p => p + 1), 50)
        return () => clearTimeout(timeout)
      }
      if (decoderPosition >= displayText.length) {
        const timeout = setTimeout(() => {
          setDecoderPass(p => p + 1)
          setDecoderPosition(0)
        }, 200)
        return () => clearTimeout(timeout)
      }
    }
  }, [decoderPosition, decoderPass, displayText.length])

  const getCharAtPosition = (char: string, index: number) => {
    if (decoderPass > 0 && decoderPass <= 3 && index === decoderPosition) {
      return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    }
    if (decoderPass === 0 && displayText.length < currentSentence.length) {
      const dist = displayText.length - 1 - index
      if (dist >= 0 && dist < 3 && Math.random() > 0.5) {
        return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      }
    }
    return char
  }

  const spinner = SPINNER_FRAMES[spinnerFrame % SPINNER_FRAMES.length]

  return (
    <div className="text-xs text-white whitespace-pre flex items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <span style={{ opacity: 0.4 }}>{spinner}</span>
      <span>
        {displayText.split("").map((char, index) => (
          <span key={`${currentSentenceIndex}-${index}-${glitchFrame}-${decoderPosition}`}>
            {getCharAtPosition(char, index)}
          </span>
        ))}
      </span>
    </div>
  )
}
