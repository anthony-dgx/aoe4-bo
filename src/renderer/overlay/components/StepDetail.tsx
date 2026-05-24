import React from 'react'
import type { BuildStep } from '../../../shared/types'

interface StepDetailProps {
  step: BuildStep
}

const RESOURCE_ICONS: { key: keyof BuildStep; icon: string; label: string }[] = [
  { key: 'food', icon: '🍖', label: 'food' },
  { key: 'wood', icon: '🪵', label: 'wood' },
  { key: 'gold', icon: '🪙', label: 'gold' },
  { key: 'stone', icon: '🪨', label: 'stone' },
]

export function StepDetail({ step }: StepDetailProps) {
  const resources = RESOURCE_ICONS.filter((r) => {
    const val = step[r.key]
    return typeof val === 'number' && val > 0
  })

  return (
    <div className="bg-[#c8a84b]/10 border border-[#c8a84b]/30 rounded-lg p-2.5 flex flex-col gap-1.5">
      {/* Time + description */}
      <div className="flex items-start gap-2">
        {step.time && (
          <span className="text-[#c8a84b] text-xs font-mono font-semibold flex-shrink-0 mt-0.5">
            {step.time}
          </span>
        )}
        <p className="text-white text-xs leading-relaxed font-medium">{step.description}</p>
      </div>

      {/* Resources */}
      {resources.length > 0 && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {resources.map(({ key, icon, label }) => (
            <div key={key} className="flex items-center gap-1" title={label}>
              <span className="text-sm leading-none">{icon}</span>
              <span className="text-white/70 text-xs font-semibold">{step[key]}</span>
            </div>
          ))}
        </div>
      )}

      {step.type === 'ageUp' && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-bold text-[#c8a84b] uppercase tracking-widest">
            → Age {step.age}
          </span>
        </div>
      )}
    </div>
  )
}
