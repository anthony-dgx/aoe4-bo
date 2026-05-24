import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BuildOrder, BuildStep } from '../../../shared/types'
import { StepDetail } from './StepDetail'

interface BuildOrderTrackerProps {
  build: BuildOrder
  currentIndex: number
  onNext: () => void
  onPrev: () => void
}

const AGE_LABELS = ['I', 'II', 'III', 'IV']

function getCurrentAge(steps: BuildStep[], currentIndex: number): number {
  let age = 1
  for (let i = 0; i <= currentIndex && i < steps.length; i++) {
    if (steps[i].age > age) age = steps[i].age
  }
  return age
}

function StepRow({
  step,
  index,
  currentIndex,
}: {
  step: BuildStep
  index: number
  currentIndex: number
}) {
  const isPast = index < currentIndex
  const isCurrent = index === currentIndex
  const isFuture = index > currentIndex

  return (
    <div
      className={[
        'flex items-start gap-2 px-2 py-1.5 rounded-lg transition-colors',
        isCurrent ? 'bg-[#c8a84b]/10 border border-[#c8a84b]/30' : 'border border-transparent',
        isPast ? 'opacity-35' : '',
        isFuture ? 'opacity-50' : '',
      ].join(' ')}
    >
      {/* Step indicator */}
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
        {isPast ? (
          <span className="text-green-400 text-xs">✓</span>
        ) : isCurrent ? (
          <div className="w-2 h-2 rounded-full bg-[#c8a84b]" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Time */}
        {step.time && (
          <span className={`text-[10px] font-mono font-semibold ${isCurrent ? 'text-[#c8a84b]' : 'text-white/35'}`}>
            {step.time}
          </span>
        )}
        {/* Description */}
        <p className={`text-xs leading-snug ${isCurrent ? 'text-white font-medium' : 'text-white/55'}`}>
          {step.type === 'ageUp' && (
            <span className={`font-bold mr-1 ${isCurrent ? 'text-[#c8a84b]' : ''}`}>
              [Age {step.age}]
            </span>
          )}
          {step.description}
        </p>
      </div>
    </div>
  )
}

export function BuildOrderTracker({
  build,
  currentIndex,
  onNext,
  onPrev,
}: BuildOrderTrackerProps) {
  const steps = build.steps
  const currentAge = getCurrentAge(steps, currentIndex)
  const currentStep = steps[currentIndex] ?? null
  const total = steps.length
  const isFirst = currentIndex === 0
  const isLast = currentIndex >= total - 1

  // Visible window: 2 before, current, 2 after
  const windowStart = Math.max(0, currentIndex - 2)
  const windowEnd = Math.min(total - 1, currentIndex + 2)
  const visibleSteps = steps.slice(windowStart, windowEnd + 1)

  return (
    <div className="bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/8 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs font-semibold truncate">{build.title}</p>
          <span className="text-[10px] text-white/35 uppercase tracking-wide">{build.civ}</span>
        </div>
        <span className="text-white/30 text-[10px] font-mono flex-shrink-0">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Age progress dots */}
      <div className="flex items-center justify-center gap-3 px-3 py-2 border-b border-white/5">
        {AGE_LABELS.map((label, i) => {
          const age = i + 1
          const isActive = age === currentAge
          const isPast = age < currentAge
          return (
            <div key={age} className="flex items-center gap-1.5">
              <div
                className={[
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors',
                  isActive
                    ? 'bg-[#c8a84b] text-black'
                    : isPast
                    ? 'bg-[#c8a84b]/30 text-[#c8a84b]/70'
                    : 'bg-white/8 text-white/25',
                ].join(' ')}
              >
                {label}
              </div>
              {i < AGE_LABELS.length - 1 && (
                <div className={`w-3 h-px ${age < currentAge ? 'bg-[#c8a84b]/40' : 'bg-white/10'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Current step detail */}
      {currentStep && (
        <div className="px-2.5 py-2 border-b border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <StepDetail step={currentStep} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Step list (scrollable window of 5) */}
      <div className="flex flex-col gap-0.5 px-1 py-1.5 max-h-[140px] overflow-y-auto">
        {visibleSteps.map((step, i) => {
          const absoluteIndex = windowStart + i
          return (
            <StepRow
              key={absoluteIndex}
              step={step}
              index={absoluteIndex}
              currentIndex={currentIndex}
            />
          )
        })}
      </div>

      {/* Prev/Next buttons */}
      <div className="flex items-center gap-2 px-2.5 py-2 border-t border-white/8">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex-1 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 text-xs font-semibold hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="flex-1 py-1.5 bg-[#c8a84b]/15 border border-[#c8a84b]/30 rounded-lg text-[#c8a84b] text-xs font-semibold hover:bg-[#c8a84b]/25 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
