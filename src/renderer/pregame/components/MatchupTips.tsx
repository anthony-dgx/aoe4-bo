import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MatchupTipsProps {
  tips: string
  loading: boolean
}

function parseBullets(tips: string): string[] {
  return tips
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean)
}

function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return (
    <div className={`h-3 ${width} bg-white/8 rounded animate-pulse`} />
  )
}

export function MatchupTips({ tips, loading }: MatchupTipsProps) {
  const bullets = parseBullets(tips)
  const hasContent = tips.trim().length > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[#c8a84b]">⚡</span>
        <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40">Matchup Tips</h3>
        {loading && (
          <span className="text-xs text-white/30 ml-auto">Generating…</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!hasContent && !loading ? (
          // Skeleton placeholder
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2.5 p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <SkeletonLine width="w-3/4" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-5/6" />
            <SkeletonLine width="w-2/3" />
            <SkeletonLine width="w-full" />
          </motion.div>
        ) : loading && bullets.length === 0 ? (
          // Streaming state — no bullets yet, show raw text with cursor
          <motion.div
            key="streaming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {tips}
              <span className="inline-block w-0.5 h-4 bg-[#c8a84b] ml-0.5 align-text-bottom animate-pulse" />
            </p>
          </motion.div>
        ) : bullets.length > 0 ? (
          // Rendered bullets
          <motion.div
            key="bullets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2"
          >
            {bullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="flex items-start gap-2.5"
              >
                <span className="text-[#c8a84b] mt-0.5 flex-shrink-0 text-xs">•</span>
                <p className="text-white/80 text-sm leading-relaxed">{bullet}</p>
              </motion.div>
            ))}
            {loading && (
              <span className="inline-block w-0.5 h-4 bg-[#c8a84b] ml-3 animate-pulse" />
            )}
          </motion.div>
        ) : (
          // Has content but no parsed bullets — show raw
          <motion.div
            key="raw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl"
          >
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {tips}
              {loading && (
                <span className="inline-block w-0.5 h-4 bg-[#c8a84b] ml-0.5 align-text-bottom animate-pulse" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
