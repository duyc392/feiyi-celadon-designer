import { useRef, useState } from 'react'

interface SketchUploaderProps {
  onUpload: (imageBase64: string) => void
  label?: string
}

export default function SketchUploader({ onUpload, label = '拍照上传手绘稿' }: SketchUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setPreview(base64)
      onUpload(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleCapture = () => {
    fileInputRef.current?.setAttribute('capture', 'environment')
    fileInputRef.current?.click()
  }

  const handlePick = () => {
    fileInputRef.current?.removeAttribute('capture')
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {preview ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#5b7a6f] bg-white">
            <img src={preview} alt="手绘稿预览" className="w-full h-56 object-contain" />
            <button
              onClick={() => { setPreview(null); onUpload('') }}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full
                         flex items-center justify-center text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-center text-[#5b7a6f]">已上传，点击可重新拍摄</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCapture}
            className="p-6 rounded-2xl bg-white border-2 border-dashed border-[#d4cec0]
                       flex flex-col items-center gap-2 active:bg-[#f0ebe0] transition-colors
                       touch-target"
          >
            <span className="text-3xl">📷</span>
            <span className="text-base font-medium text-[#2c2416]">拍照</span>
            <span className="text-xs text-[#8a7e6b]">直接拍摄手绘稿</span>
          </button>
          <button
            onClick={handlePick}
            className="p-6 rounded-2xl bg-white border-2 border-dashed border-[#d4cec0]
                       flex flex-col items-center gap-2 active:bg-[#f0ebe0] transition-colors
                       touch-target"
          >
            <span className="text-3xl">🖼️</span>
            <span className="text-base font-medium text-[#2c2416]">相册</span>
            <span className="text-xs text-[#8a7e6b]">从手机相册选取</span>
          </button>
        </div>
      )}

      <p className="text-xs text-center text-[#b8a898]">{label}</p>
    </div>
  )
}
