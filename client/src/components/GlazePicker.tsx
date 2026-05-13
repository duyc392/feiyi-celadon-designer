import { glazes } from '../data/celadonKb'

interface GlazePickerProps {
  onSelect: (glazeId: string, glazeName: string, hex: string) => void
  selected?: string
}

export default function GlazePicker({ onSelect, selected }: GlazePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {glazes.map((g) => {
        const isSelected = selected === g.id
        return (
          <button
            key={g.id}
            onClick={() => onSelect(g.id, g.name, g.hex)}
            className={`p-4 rounded-2xl text-left transition-all active:scale-95 touch-target
              ${isSelected
                ? 'bg-[#5b7a6f] text-white shadow-lg'
                : 'bg-white border border-[#d4cec0] active:bg-[#f0ebe0]'
              }`}
          >
            <div
              className="w-full h-12 rounded-xl mb-2 border border-[#d4cec0]"
              style={{ backgroundColor: g.hex }}
            />
            <div className="text-base font-semibold">{g.name}</div>
            <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#8a7e6b]'}`}>
              {g.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
