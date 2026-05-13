import { useState } from 'react'
import type { SketchAnalysisResult } from '../types'
import { reviseSketch } from '../services/api'

interface LineArtViewerProps {
  analysis: SketchAnalysisResult
  onConfirm: (lineArt: string) => void
}

export default function LineArtViewer({ analysis, onConfirm }: LineArtViewerProps) {
  const [feedback, setFeedback] = useState('')
  const [revised, setRevised] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const displayImage = revised || analysis.cleanLineArt

  const handleRevise = async () => {
    if (!feedback.trim()) return
    setLoading(true)
    try {
      const result = await reviseSketch(displayImage, feedback)
      setRevised(result.revisedLineArt)
      setFeedback('')
    } catch {
      // keep current
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#2c2416] text-center">AI 识别结果</h3>

      {/* 线稿图 */}
      <div className="rounded-2xl overflow-hidden border-2 border-[#d4cec0] bg-white">
        <img src={displayImage} alt="识别线稿" className="w-full h-56 object-contain" />
      </div>

      {/* 识别信息 */}
      <div className="bg-white rounded-xl p-4 space-y-2">
        {analysis.recognition.shapeName && (
          <div className="flex justify-between">
            <span className="text-[#8a7e6b]">识别器型</span>
            <span className="font-bold text-[#2c2416]">{analysis.recognition.shapeName}</span>
          </div>
        )}
        {analysis.recognition.patternType && (
          <div className="flex justify-between">
            <span className="text-[#8a7e6b]">纹样类型</span>
            <span className="font-bold text-[#2c2416]">{analysis.recognition.patternType}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#8a7e6b]">识别类型</span>
          <span className="font-bold text-[#2c2416]">
            {analysis.recognition.type === 'shape' ? '器型轮廓' : analysis.recognition.type === 'pattern' ? '纹样图案' : '混合'}
          </span>
        </div>
      </div>

      {/* AI 建议 */}
      {analysis.suggestions.length > 0 && (
        <div className="bg-[#e8f0eb] rounded-xl p-4">
          <p className="text-sm font-bold text-[#5b7a6f] mb-2">AI 建议</p>
          <ul className="space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-sm text-[#2c2416] flex gap-2">
                <span>💡</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 修正反馈 */}
      <div className="flex gap-2">
        <input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="需要调整？比如'杯口再大一点'"
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#d4cec0]
                     text-base text-[#2c2416] placeholder-[#b8a898]
                     focus:outline-none focus:ring-2 focus:ring-[#5b7a6f]"
        />
        <button
          onClick={handleRevise}
          disabled={loading || !feedback.trim()}
          className="px-4 py-3 bg-[#5b7a6f] text-white rounded-xl font-semibold
                     disabled:opacity-50 active:bg-[#4a6b5f] touch-target"
        >
          {loading ? '...' : '调整'}
        </button>
      </div>

      {/* 确认按钮 */}
      <button
        onClick={() => onConfirm(displayImage)}
        className="w-full py-4 bg-[#5b7a6f] text-white rounded-2xl font-bold text-lg
                   active:bg-[#4a6b5f] shadow-lg touch-target"
      >
        确认线稿，开始生图 →
      </button>
    </div>
  )
}
