import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BuildOrder, GameState } from '../../shared/types'
import { useOverlayStore } from './store/useOverlayStore'
import { BuildOrderTracker } from './components/BuildOrderTracker'
import { TipsPanel } from './components/TipsPanel'

// Extend window for TS
declare global {
  interface Window {
    electronAPI: {
      setInteractive: (val: boolean) => void
      onToggle: (cb: () => void) => void
      onStepAdvance: (cb: () => void) => void
      onStepRetreat: (cb: () => void) => void
      onBuildChanged: (cb: (build: BuildOrder) => void) => void
      onGameStarted: (cb: (state: GameState) => void) => void
      onGameEnded: (cb: (state: GameState) => void) => void
      builds: {
        list: () => Promise<BuildOrder[]>
        select: (id: string) => Promise<void>
        getActive: () => Promise<BuildOrder | null>
      }
      tips: {
        get: (myCiv: string, opponentCiv: string, gameMode: string) => Promise<string>
      }
    }
  }
}

function DragHandle() {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-t-xl bg-black/70 border border-white/10 cursor-grab active:cursor-grabbing select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">AoE4</span>
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
        ))}
      </div>
      <span className="text-[10px] text-white/20">⠿ drag</span>
    </div>
  )
}

export default function App() {
  const {
    activeBuild,
    setActiveBuild,
    currentStepIndex,
    nextStep,
    prevStep,
    setGameState,
    tips,
    setTips,
    tipsExpanded,
    toggleTips,
    builds,
    setBuilds,
  } = useOverlayStore()

  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      try {
        const allBuilds = await window.electronAPI.builds.list()
        setBuilds(allBuilds)
      } catch {
        // ignore
      }
      try {
        const active = await window.electronAPI.builds.getActive()
        if (active) setActiveBuild(active)
      } catch {
        // ignore
      }
    }

    // Subscribe to events
    window.electronAPI.onBuildChanged((build) => {
      setActiveBuild(build)
    })

    window.electronAPI.onStepAdvance(() => {
      nextStep()
    })

    window.electronAPI.onStepRetreat(() => {
      prevStep()
    })

    window.electronAPI.onGameStarted((state) => {
      setGameState(state)
      // Load tips for game matchup
      const me = state.myTeam[0]
      const opp = state.opponentTeam[0]
      if (me && opp) {
        window.electronAPI.tips
          .get(me.civilization, opp.civilization, state.kind ?? '1v1')
          .then((t) => setTips(t))
          .catch(() => {})
      }
    })

    window.electronAPI.onGameEnded((state) => {
      setGameState(state)
    })

    window.electronAPI.onToggle(() => {
      // The main process handles visibility — no action needed here
    })

    init()
  }, [])

  function handleMouseEnter() {
    window.electronAPI.setInteractive(true)
  }

  function handleMouseLeave() {
    window.electronAPI.setInteractive(false)
  }

  return (
    <div
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col gap-2 p-1.5 min-w-[260px] max-w-[340px] select-none"
    >
      {/* Drag handle */}
      <DragHandle />

      <AnimatePresence mode="popLayout">
        {activeBuild ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <BuildOrderTracker
              build={activeBuild}
              currentIndex={currentStepIndex}
              onNext={nextStep}
              onPrev={prevStep}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-5 text-center"
          >
            <p className="text-white/35 text-xs">No build selected.</p>
            <p className="text-white/20 text-[10px] mt-1">Open the pregame window to pick one.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips panel */}
      <AnimatePresence>
        {tips && (
          <motion.div
            key="tips"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <TipsPanel tips={tips} expanded={tipsExpanded} onToggle={toggleTips} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
