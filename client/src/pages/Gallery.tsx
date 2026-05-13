import { useNavigate } from 'react-router-dom'

export default function Gallery() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh flex flex-col bg-[#f5f0e8]">
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={() => navigate('/')}
          className="text-[#5b7a6f] text-lg touch-target flex items-center gap-1"
        >
          ← 返回
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-6xl mb-4">📂</p>
        <p className="text-lg text-[#8a7e6b]">暂无作品</p>
        <p className="text-sm text-[#b8a898] mt-1">开始您的第一个设计吧</p>
      </div>
    </div>
  )
}
