import type { GuideOption } from '../types'

interface OptionCardsProps {
  options: GuideOption[]
  onSelect: (option: GuideOption) => void
  multi?: boolean
  selected?: string[]
}

export default function OptionCards({ options, onSelect, selected }: OptionCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const isSelected = selected?.includes(opt.id)
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={`p-4 rounded-2xl text-left transition-all active:scale-95 touch-target
              ${isSelected
                ? 'bg-[#5b7a6f] text-white shadow-lg ring-2 ring-[#5b7a6f] ring-offset-2'
                : 'bg-white border border-[#d4cec0] text-[#2c2416] active:bg-[#f0ebe0]'
              }`}
          >
            {/* 釉色色块 */}
            {opt.colorHex && (
              <div
                className="w-10 h-10 rounded-full mb-2 border border-[#d4cec0]"
                style={{ backgroundColor: opt.colorHex }}
              />
            )}
            <div className="text-base font-semibold">{opt.label}</div>
            {opt.description && (
              <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#8a7e6b]'}`}>
                {opt.description}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
