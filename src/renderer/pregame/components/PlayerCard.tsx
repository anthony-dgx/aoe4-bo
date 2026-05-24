import React from 'react'
import type { TeamPlayer } from '../../../shared/types'

const CIV_COLORS: Record<string, string> = {
  abbasid: '#c9a96e',
  ayyubids: '#d4a84b',
  byzantines: '#6b8cba',
  chinese: '#d4251c',
  dehli: '#7cb97c',
  english: '#4a7fc1',
  french: '#5a9bd4',
  hre: '#c8a84b',
  japanese: '#e05c5c',
  jeanne: '#f0c040',
  malians: '#e8a030',
  mongols: '#b0c860',
  ottomans: '#d45c3c',
  order: '#8090c8',
  rus: '#7a9a5c',
  zhu: '#c84040',
}

function getCivColor(civ: string): string {
  const key = civ.toLowerCase().replace(/\s+/g, '')
  return CIV_COLORS[key] ?? '#888888'
}

interface PlayerCardProps {
  player: TeamPlayer | null
  label: 'YOU' | 'OPPONENT'
  isMe?: boolean
}

export function PlayerCard({ player, label, isMe = false }: PlayerCardProps) {
  const borderColor = isMe ? 'border-l-[#c8a84b]' : 'border-l-red-500'
  const labelColor = isMe ? 'text-[#c8a84b]' : 'text-red-400'

  if (!player) {
    return (
      <div className={`bg-white/5 border border-white/10 border-l-4 ${borderColor} rounded-xl p-4 flex flex-col gap-1 min-w-[180px]`}>
        <span className={`text-xs font-semibold tracking-widest uppercase ${labelColor}`}>{label}</span>
        <span className="text-white/30 text-sm italic mt-1">Profile not set</span>
        <span className="text-white/20 text-xs mt-0.5">No data available</span>
      </div>
    )
  }

  const civColor = getCivColor(player.civilization)

  return (
    <div className={`bg-white/5 border border-white/10 border-l-4 ${borderColor} rounded-xl p-4 flex flex-col gap-1 min-w-[180px]`}>
      <span className={`text-xs font-semibold tracking-widest uppercase ${labelColor}`}>{label}</span>
      <span className="text-white text-lg font-semibold leading-tight truncate max-w-[200px]" title={player.name}>
        {player.name}
      </span>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: civColor }}
          />
          <span className="text-white/70 text-sm font-medium">
            {player.civilization}
          </span>
        </div>
        {player.rating !== null && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-[#c8a84b] border border-[#c8a84b]/30">
            {player.rating} MMR
          </span>
        )}
      </div>
    </div>
  )
}
