import { useState, useEffect, useRef } from 'react'
import type { GuideStep, GuideOption, DesignDimension, ProductType } from '../types'
import OptionCards from './OptionCards'
import GlazePicker from './GlazePicker'
import VoiceButton from './VoiceButton'
import SketchUploader from './SketchUploader'

interface ChatGuideProps {
  step: GuideStep
  onSelect: (value: any) => void
  onSkip: () => void
}

export default function ChatGuide({ step, onSelect, onSkip }: ChatGuideProps) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; options?: GuideOption[] }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 新步骤：添加 AI 提问
    if (step.question) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: step.question,
        options: step.options,
      }])
    }
  }, [step.dimension, step.question])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleChoice = (option: GuideOption) => {
    setMessages(prev => [...prev, { role: 'user', content: option.label }])
    onSelect(option)
  }

  const handleVoice = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: `🎤 ${text}` }])
    onSelect({ id: 'custom', label: text })
  }

  const handleGlaze = (id: string, name: string, hex: string) => {
    setMessages(prev => [...prev, { role: 'user', content: `釉色: ${name}` }])
    onSelect({ id, label: name, colorHex: hex })
  }

  const handleSketch = (imageBase64: string) => {
    if (!imageBase64) return
    setMessages(prev => [...prev, { role: 'user', content: '📷 上传了手绘稿' }])
    onSelect({ id: 'sketch', label: '手绘稿', imageBase64 })
  }

  const handleSkip = () => {
    setMessages(prev => [...prev, { role: 'user', content: '跳过 →' }])
    onSkip()
  }

  const isProductTypeStep = step.dimension === 'product-type'
  const isGlazeStep = step.dimension === 'glaze'
  const showSketchUpload = step.allowSketch && step.dimension === 'shape'

  return (
    <div className="flex flex-col h-full">
      {/* 对话历史 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-base
                ${msg.role === 'ai'
                  ? 'bg-white text-[#2c2416] rounded-tl-sm shadow-sm'
                  : 'bg-[#5b7a6f] text-white rounded-tr-sm'
                }`}
            >
              {msg.role === 'ai' && <span className="text-sm mr-1">🤖</span>}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 操作区 */}
      <div className="px-4 pb-6 pt-2 space-y-4">
        {/* 选项按钮 */}
        {step.options.length > 0 && step.dimension !== 'glaze' && (
          <OptionCards options={step.options} onSelect={handleChoice} />
        )}

        {/* 釉色选择 */}
        {isGlazeStep && <GlazePicker onSelect={handleGlaze} />}

        {/* 手绘上传 */}
        {showSketchUpload && (
          <div className="mt-3">
            <SketchUploader onUpload={handleSketch} label="或者手绘一个杯型？" />
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="flex items-center gap-3">
          {(step.allowVoice && !isGlazeStep) && (
            <VoiceButton onResult={handleVoice} />
          )}

          <div className="flex-1 text-sm text-[#b8a898]">
            {step.allowVoice && '点击 🎤 语音输入'}
          </div>

          {step.allowSkip && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-[#8a7e6b] bg-white/60 rounded-xl
                         border border-[#d4cec0] active:bg-white/80 touch-target"
            >
              跳过
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
