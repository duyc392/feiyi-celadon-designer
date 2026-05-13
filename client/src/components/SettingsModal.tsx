import { useState } from 'react'

interface SettingsModalProps {
  onClose: () => void
  onSave: (apiKey: string) => void
  hasKey: boolean
}

export default function SettingsModal({ onClose, onSave, hasKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim())
      onSave(apiKey.trim())
      setSaved(true)
      setTimeout(onClose, 1500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
         onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-[#f5f0e8] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md
                      max-h-[80vh] overflow-y-auto shadow-2xl"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#2c2416]">⚙️ API 设置</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       bg-white border border-[#d4cec0] text-[#8a7e6b]">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* API 地址（只读展示） */}
          <div>
            <label className="block text-sm font-semibold text-[#5c5340] mb-2">
              API 地址
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-[#e8ede9] border border-[#d4cec0]
                           text-base text-[#5b7a6f] font-mono">
              https://grsai.dakka.com.cn
            </div>
            <p className="text-xs text-[#8a7e6b] mt-1">所有 AI 请求通过此中转服务</p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold text-[#5c5340] mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={hasKey ? '已配置 ✓ · 输入新 Key 替换' : '输入你的 API Key'}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#d4cec0]
                         text-base text-[#2c2416] placeholder-[#b8a898]
                         focus:outline-none focus:ring-2 focus:ring-[#5b7a6f]"
            />
          </div>

          <div className="bg-[#e8f0eb] rounded-xl p-4">
            <p className="text-sm text-[#5b7a6f] font-semibold mb-2">💡 功能说明</p>
            <ul className="text-xs text-[#5c5340] space-y-1">
              <li>• 🆓 线稿预处理 — 免费，手机本地运行</li>
              <li>• 🤖 线稿分析 — 当前使用安全模式，避免误触发错误接口</li>
              <li>• 🎨 AI 生图 — 通过你的中转地址调用 GPT Image 2</li>
              <li>• 🔒 Key 仅存储在浏览器本地</li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all
              ${saved
                ? 'bg-green-500 text-white'
                : 'bg-[#5b7a6f] text-white active:bg-[#4a6b5f] disabled:opacity-50'
              }`}
          >
            {saved ? '✅ 已保存' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function getApiKey(): string {
  return localStorage.getItem('openai_api_key') || ''
}
