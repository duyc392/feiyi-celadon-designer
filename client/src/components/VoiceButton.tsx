import { useState, useRef, useCallback } from 'react'

interface VoiceButtonProps {
  onResult: (text: string) => void
}

export default function VoiceButton({ onResult }: VoiceButtonProps) {
  const [listening, setListening] = useState(false)
  const [notSupported, setNotSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setNotSupported(true)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      onResult(text)
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [onResult])

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  if (notSupported) return null

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl
        transition-all active:scale-90 touch-target
        ${listening
          ? 'bg-red-500 text-white voice-listening'
          : 'bg-white border-2 border-[#d4cec0] text-[#5b7a6f]'
        }`}
      aria-label={listening ? '停止录音' : '语音输入'}
    >
      🎤
    </button>
  )
}
