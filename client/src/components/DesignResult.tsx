import { useState } from 'react'
import type { GeneratedImage } from '../types'

interface DesignResultProps {
  images: GeneratedImage[]
  prompt: string
  onRefine: (feedback: string) => void
  onRegenerate: () => void
  loading: boolean
}

export default function DesignResult({ images, prompt, onRefine, onRegenerate, loading }: DesignResultProps) {
  const [feedback, setFeedback] = useState('')
  const latest = images[images.length - 1]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#2c2416] text-center">生成结果</h3>

      {/* 主图 */}
      {latest && (
        <div className="rounded-2xl overflow-hidden border-2 border-[#d4cec0] bg-white">
          <img src={latest.imageUrl} alt="设计效果图" className="w-full aspect-square object-contain" />
        </div>
      )}

      {/* Loading */}
      {loading && !latest && (
        <div className="aspect-square flex items-center justify-center bg-white rounded-2xl border-2 border-[#d4cec0]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#5b7a6f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[#8a7e6b]">AI 正在生成设计...</p>
          </div>
        </div>
      )}

      {/* 版本历史 */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <img
              key={img.id}
              src={img.imageUrl}
              alt={`版本 ${i + 1}`}
              className={`w-16 h-16 rounded-xl object-cover border-2 flex-shrink-0
                ${i === images.length - 1 ? 'border-[#5b7a6f]' : 'border-[#d4cec0]'}`}
            />
          ))}
        </div>
      )}

      {/* Prompt 展示 */}
      <details className="bg-white rounded-xl p-4">
        <summary className="text-sm text-[#8a7e6b] cursor-pointer">查看 Prompt</summary>
        <p className="mt-2 text-sm text-[#5c5340] leading-relaxed">{prompt}</p>
      </details>

      {/* 反馈调整 */}
      <div className="flex gap-2">
        <input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="哪里需要改？比如'纹样太密'"
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#d4cec0]
                     text-base text-[#2c2416] placeholder-[#b8a898]
                     focus:outline-none focus:ring-2 focus:ring-[#5b7a6f]"
        />
        <button
          onClick={() => { onRefine(feedback); setFeedback('') }}
          disabled={loading || !feedback.trim()}
          className="px-4 py-3 bg-[#5b7a6f] text-white rounded-xl font-semibold
                     disabled:opacity-50 active:bg-[#4a6b5f] touch-target"
        >
          {loading ? '...' : '修改'}
        </button>
      </div>

      {/* 重新生成 */}
      <button
        onClick={onRegenerate}
        disabled={loading}
        className="w-full py-3 text-[#5b7a6f] bg-white rounded-xl border border-[#d4cec0]
                   font-semibold active:bg-[#f0ebe0] touch-target disabled:opacity-50"
      >
        重新生成
      </button>
    </div>
  )
}
