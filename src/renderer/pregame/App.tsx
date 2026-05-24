import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, BuildOrder } from '../../shared/types'
import { usePregameStore } from './store/usePregameStore'
import { PlayerCard } from './components/PlayerCard'
import { CivMatchup } from './components/CivMatchup'
import { BuildOrderPicker } from './components/BuildOrderPicker'
import { MatchupTips } from './components/MatchupTips'
import { SettingsDrawer } from './components/SettingsDrawer'
import { ManualGameSetup } from './components/ManualGameSetup'

// Extend window for TS
declare global {
  interface Window {
    electronAPI: {
      settings: {
        getAll: () => Promise<Record<string, unknown>>
        get: (key: string) => Promise<unknown>
        set: (key: string, value: unknown) => Promise<void>
        lookupProfile: (id: string) => Promise<{ name: string } | null>
      }
      builds: {
        fetch: (url: string) => Promise<BuildOrder>
        list: () => Promise<BuildOrder[]>
        delete: (id: string) => Promise<void>
        getActive: () => Promise<BuildOrder | null>
      }
      game: {
        getState: () => Promise<GameState>
        forceRefresh: () => Promise<void>
        onStarted: (cb: (state: GameState) => void) => void
        onEnded: (cb: (state: GameState) => void) => void
      }
      tips: {
        get: (myCiv: string, opponentCiv: string, gameMode: string) => Promise<string>
        onChunk: (cb: (chunk: string) => void) => void
        onDone: (cb: (tips: string) => void) => void
      }
      startTracking: (buildId: string) => void
      skip: () => void
      manualStart: (state: GameState) => void
      onManualMode: (cb: () => void) => void
    }
  }
}

function getMyPlayer(gameState: GameState) {
  return gameState.myTeam[0] ?? null
}

function getOpponentPlayer(gameState: GameState) {
  return gameState.opponentTeam[0] ?? null
}

export default function App() {
  const [manualMode, setManualMode] = useState(false)

  const {
    gameState,
    setGameState,
    tips,
    tipsLoading,
    appendTipChunk,
    setTips,
    setTipsLoading,
    builds,
    setBuilds,
    selectedBuildId,
    setSelectedBuildId,
    settingsOpen,
    toggleSettings,
    importUrl,
    importing,
    importError,
    setImporting,
    setImportError,
  } = usePregameStore()

  // Bootstrap on mount
  useEffect(() => {
    async function init() {
      // Load builds
      try {
        const allBuilds = await window.electronAPI.builds.list()
        setBuilds(allBuilds)
        // Pre-select active build if any
        const active = await window.electronAPI.builds.getActive()
        if (active) setSelectedBuildId(active.id)
      } catch {
        // ignore
      }

      // Load initial game state
      try {
        const state = await window.electronAPI.game.getState()
        if (state) {
          setGameState(state)
          if (state.phase === 'in_game') {
            triggerTips(state)
          }
        }
      } catch {
        // ignore
      }
    }

    // Subscribe to tip streaming
    window.electronAPI.tips.onChunk((chunk) => {
      appendTipChunk(chunk)
    })

    window.electronAPI.tips.onDone((fullTips) => {
      setTips(fullTips)
      setTipsLoading(false)
    })

    // Subscribe to game events
    window.electronAPI.game.onStarted((state) => {
      setGameState(state)
      setManualMode(false)
      triggerTips(state)
    })

    window.electronAPI.game.onEnded((state) => {
      setGameState(state)
    })

    // Tray → "Manual Game Setup"
    window.electronAPI.onManualMode(() => {
      setManualMode(true)
    })

    init()
  }, [])

  function triggerTips(state: GameState) {
    const me = state.myTeam[0]
    const opp = state.opponentTeam[0]
    if (!me || !opp) return
    const mode = state.kind ?? '1v1'
    setTipsLoading(true)
    setTips('')
    window.electronAPI.tips.get(me.civilization, opp.civilization, mode).catch(() => {
      setTipsLoading(false)
    })
  }

  async function handleImport(url: string): Promise<void> {
    setImporting(true)
    setImportError(null)
    try {
      const build = await window.electronAPI.builds.fetch(url)
      const allBuilds = await window.electronAPI.builds.list()
      setBuilds(allBuilds)
      setSelectedBuildId(build.id)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed. Check the URL and try again.')
    } finally {
      setImporting(false)
    }
  }

  function handleStartTracking() {
    if (!selectedBuildId) return
    window.electronAPI.startTracking(selectedBuildId)
  }

  const myPlayer = gameState ? getMyPlayer(gameState) : null
  const opponentPlayer = gameState ? getOpponentPlayer(gameState) : null
  const inGame = gameState?.phase === 'in_game'
  const myCiv = myPlayer?.civilization ?? ''

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0 bg-black/20">
        <div className="flex items-center gap-2.5">
          <span className="text-[#c8a84b] text-lg">⚔️</span>
          <span className="font-semibold text-sm tracking-wide text-white/80">AoE4 Companion</span>
          {inGame && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <button
          onClick={toggleSettings}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          title="Settings"
        >
          ⚙️
        </button>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {/* Player Matchup */}
        <AnimatePresence>
          {gameState && inGame && (
            <motion.section
              key="matchup"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {/* VS banner */}
              <CivMatchup
                myTeam={gameState.myTeam}
                opponentTeam={gameState.opponentTeam}
                kind={gameState.kind}
              />

              {/* Player cards */}
              <div className="grid grid-cols-2 gap-3">
                <PlayerCard player={myPlayer} label="YOU" isMe />
                <PlayerCard player={opponentPlayer} label="OPPONENT" isMe={false} />
              </div>

              {/* Map */}
              {gameState.map && (
                <div className="flex items-center gap-2 text-xs text-white/35">
                  <span>🗺️</span>
                  <span>{gameState.map}</span>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Idle state / Manual setup */}
        <AnimatePresence mode="wait">
          {manualMode ? (
            <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManualGameSetup
                onStart={(state) => {
                  window.electronAPI.manualStart(state)
                  setGameState(state)
                  setManualMode(false)
                  triggerTips(state)
                }}
                onCancel={() => setManualMode(false)}
              />
            </motion.div>
          ) : (!gameState || gameState.phase === 'idle') ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/3 border border-white/8 rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-2">⚔️</div>
              <p className="text-white/40 text-sm">Waiting for a game to start…</p>
              <p className="text-white/25 text-xs mt-1">Launch AoE4 and queue up, or set up manually below.</p>
              <button
                onClick={() => setManualMode(true)}
                className="mt-3 px-4 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                Manual Game Setup
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Build Order Picker */}
        <section>
          <BuildOrderPicker
            builds={builds}
            myCiv={myCiv}
            selectedId={selectedBuildId}
            onSelect={setSelectedBuildId}
            onImport={handleImport}
            importing={importing}
            importError={importError}
          />
        </section>

        {/* Matchup Tips */}
        <AnimatePresence>
          {(tipsLoading || tips.trim().length > 0) && (
            <motion.section
              key="tips"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MatchupTips tips={tips} loading={tipsLoading} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      <footer className="flex items-center gap-3 px-5 py-4 border-t border-white/8 bg-black/20 flex-shrink-0">
        <button
          onClick={handleStartTracking}
          disabled={!selectedBuildId}
          className="flex-1 py-2.5 bg-[#c8a84b] text-black rounded-xl text-sm font-semibold hover:bg-[#e8c96b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Start Tracking
        </button>
        <button
          onClick={() => window.electronAPI.skip()}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors"
        >
          Skip
        </button>
      </footer>

      {/* Settings Drawer */}
      <SettingsDrawer open={settingsOpen} onClose={toggleSettings} />
    </div>
  )
}
