import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsModal, { getApiKey } from '../components/SettingsModal'

export default function Home() {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)
  const [hasKey, setHasKey] = useState(true)

  return (
    <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
      {/* 顶部设置按钮 */}
      <div className="px-4 pt-4 flex justify-end">
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full bg-white/80 border border-[#d4cec0]
                     flex items-center justify-center text-lg touch-target"
          aria-label="设置"
        >
          ⚙️
        </button>
      </div>

      {/* 中间 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="text-6xl mb-4">🏺</div>
        <h1 className="text-3xl font-bold text-[#2c2416] mb-2">非遗设计助手</h1>
        <p className="text-lg text-[#5c5340] mb-2">龙泉青瓷 · AI 智能设计</p>
        <p className="text-sm text-[#8a7e6b] text-center max-w-xs">
          用对话和手绘，轻松设计出您的青瓷作品
        </p>
      </div>

      {/* 底部按钮区 */}
      <div className="px-6 pb-10 space-y-4">
        <button
          onClick={() => navigate('/guide')}
          className="w-full py-5 rounded-2xl text-xl font-bold text-white
                     bg-[#5b7a6f] active:bg-[#4a6b5f] transition-colors shadow-lg
                     touch-target flex items-center justify-center gap-2"
        >
          <span>开始设计</span>
          <span className="text-2xl">→</span>
        </button>

        <button
          onClick={() => navigate('/gallery')}
          className="w-full py-4 rounded-2xl text-lg text-[#5c5340]
                     bg-white/60 active:bg-white/80 border border-[#d4cec0]
                     transition-colors touch-target"
        >
          我的作品
        </button>
      </div>

      {/* 版本号 + API状态 */}
      <p className="text-center text-xs pb-4">
        <span className="text-[#b8a898]">v1.0 · 龙泉青瓷</span>
        <span className="mx-2 text-[#d4cec0]">|</span>
        <span className={hasKey ? 'text-green-600' : 'text-[#b8a898]'}>
          {hasKey ? '🟢 API 已配置' : '⚪ API 未配置'}
        </span>
      </p>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={() => setHasKey(true)}
          hasKey={hasKey}
        />
      )}
    </div>
  )
}
