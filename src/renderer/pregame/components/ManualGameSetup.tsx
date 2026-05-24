import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CIVS } from '../../../shared/civs'
import type { GameState } from '../../../shared/types'

interface Props {
  onStart: (state: GameState) => void
  onCancel: () => void
}

const GAME_MODES = [
  { id: 'rm_1v1', label: '1v1' },
  { id: 'rm_2v2', label: '2v2' },
  { id: 'rm_3v3', label: '3v3' },
  { id: 'rm_4v4', label: '4v4' },
  { id: 'custom', label: 'Custom' },
]

function CivSelect({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500/50 cursor-pointer"
      >
        <option value="" className="bg-neutral-900">— Select civilization —</option>
        {CIVS.map((c) => (
          <option key={c.id} value={c.id} className="bg-neutral-900">
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ManualGameSetup({ onStart, onCancel }: Props) {
  const [myCiv, setMyCiv] = useState('')
  const [opponentCiv, setOpponentCiv] = useState('')
  const [myName, setMyName] = useState('')
  const [opponentName, setOpponentName] = useState('')
  const [gameMode, setGameMode] = useState('rm_1v1')

  const canStart = myCiv !== '' && opponentCiv !== ''

  function handleStart() {
    if (!canStart) return

    const state: GameState = {
      phase: 'in_game',
      gameId: Date.now(),
      startedAt: new Date().toISOString(),
      map: 'Custom',
      kind: gameMode,
      myTeam: [{ name: myName || 'Me', profileId: null, civilization: myCiv, rating: null }],
      opponentTeam: [{ name: opponentName || 'Opponent', profileId: null, civilization: opponentCiv, rating: null }]
    }
    onStart(state)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Manual Game Setup</h2>
        <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Custom / Offline</span>
      </div>

      {/* Game mode */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Game Mode</label>
        <div className="flex gap-2 flex-wrap">
          {GAME_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setGameMode(m.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                gameMode === m.id
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/80'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player names */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Your Name</label>
          <input
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
            placeholder="Optional"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Opponent Name</label>
          <input
            value={opponentName}
            onChange={(e) => setOpponentName(e.target.value)}
            placeholder="Optional"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50"
          />
        </div>
      </div>

      {/* Civ selectors */}
      <div className="grid grid-cols-2 gap-3">
        <CivSelect label="Your Civilization" value={myCiv} onChange={setMyCiv} />
        <CivSelect label="Opponent Civilization" value={opponentCiv} onChange={setOpponentCiv} />
      </div>

      {/* VS preview */}
      {myCiv && opponentCiv && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 py-2"
        >
          <span className="text-sm font-bold text-yellow-400">
            {CIVS.find((c) => c.id === myCiv)?.name}
          </span>
          <span className="text-white/30 text-xs font-bold">VS</span>
          <span className="text-sm font-bold text-red-400">
            {CIVS.find((c) => c.id === opponentCiv)?.name}
          </span>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-sm text-white/40 bg-white/5 border border-white/10 hover:text-white/70 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            canStart
              ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
          }`}
        >
          Start →
        </button>
      </div>
    </motion.div>
  )
}
