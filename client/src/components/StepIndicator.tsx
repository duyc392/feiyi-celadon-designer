interface StepIndicatorProps {
  current: number
  total: number
  labels?: string[]
}

export default function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full h-1.5 rounded-full transition-colors ${
              i < current
                ? 'bg-[#5b7a6f]'
                : i === current
                  ? 'bg-[#5b7a6f] animate-pulse'
                  : 'bg-[#d4cec0]'
            }`}
          />
          {labels && (
            <span className={`text-xs ${i <= current ? 'text-[#5b7a6f]' : 'text-[#b8a898]'}`}>
              {labels[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
