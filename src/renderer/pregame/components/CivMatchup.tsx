import React from 'react'
import { motion } from 'framer-motion'
import type { TeamPlayer } from '../../../shared/types'

interface CivMatchupProps {
  myTeam: TeamPlayer[]
  opponentTeam: TeamPlayer[]
  kind?: string | null
}

function getTeamCivLabel(team: TeamPlayer[]): string {
  if (team.length === 0) return '???'
  if (team.length === 1) return team[0].civilization.toUpperCase()
  return team.map((p) => p.civilization).join(' / ').toUpperCase()
}

function getMatchKindLabel(kind: string | null | undefined, teamSize: number): string {
  if (!kind) return `${teamSize}v${teamSize}`
  const lower = kind.toLowerCase()
  if (lower.includes('ranked')) return `${teamSize}v${teamSize} Ranked`
  if (lower.includes('quick')) return `${teamSize}v${teamSize} Quick Match`
  if (lower.includes('custom')) return `${teamSize}v${teamSize} Custom`
  return kind
}

export function CivMatchup({ myTeam, opponentTeam, kind }: CivMatchupProps) {
  const myCivLabel = getTeamCivLabel(myTeam)
  const opponentCivLabel = getTeamCivLabel(opponentTeam)
  const teamSize = Math.max(myTeam.length, opponentTeam.length, 1)
  const matchKindLabel = getMatchKindLabel(kind, teamSize)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center gap-3 py-4"
    >
      <div className="flex items-center gap-4">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-2xl font-bold text-[#c8a84b] tracking-wider"
        >
          {myCivLabel}
        </motion.span>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-white/30 text-xs tracking-widest uppercase">vs</span>
          <div className="w-px h-8 bg-white/10" />
        </div>

        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-2xl font-bold text-red-400 tracking-wider"
        >
          {opponentCivLabel}
        </motion.span>
      </div>

      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/60 tracking-wide uppercase"
      >
        {matchKindLabel}
      </motion.span>
    </motion.div>
  )
}
