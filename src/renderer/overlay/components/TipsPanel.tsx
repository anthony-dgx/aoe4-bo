import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TipsPanelProps {
  tips: string
  expanded: boolean
  onToggle: () => void
}

function parseBullets(tips: string): string[] {
  return tips
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
    .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

export function TipsPanel({ tips, expanded, onToggle }: TipsPanelProps) {
  const bullets = parseBullets(tips)
  const displayBullets = bullets.length > 0 ? bullets : tips.trim() ? [tips.trim()] : []

  return (
    <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[#c8a84b] text-xs">⚡</span>
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Tips</span>
          {displayBullets.length > 0 && (
            <span className="text-white/30 text-[10px]">({displayBullets.length})</span>
          )}
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40 text-xs"
        >
          ▾
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && displayBullets.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2.5 pt-1 flex flex-col gap-1.5 border-t border-white/8">
              {displayBullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#c8a84b] text-[10px] mt-0.5 flex-shrink-0">•</span>
                  <p className="text-white/70 text-[11px] leading-snug">{bullet}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {expanded && displayBullets.length === 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2.5 pt-1 border-t border-white/8">
              <p className="text-white/30 text-[11px] italic">No tips available.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
