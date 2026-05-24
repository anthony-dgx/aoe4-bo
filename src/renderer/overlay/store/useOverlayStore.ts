import { create } from 'zustand'
import type { BuildOrder, GameState } from '../../../shared/types'

interface OverlayStore {
  activeBuild: BuildOrder | null
  setActiveBuild: (b: BuildOrder | null) => void

  currentStepIndex: number
  nextStep: () => void
  prevStep: () => void

  gameState: GameState | null
  setGameState: (s: GameState | null) => void

  tips: string | null
  setTips: (t: string | null) => void

  tipsExpanded: boolean
  toggleTips: () => void

  builds: BuildOrder[]
  setBuilds: (b: BuildOrder[]) => void
}

export const useOverlayStore = create<OverlayStore>((set, get) => ({
  activeBuild: null,
  setActiveBuild: (b) => set({ activeBuild: b, currentStepIndex: 0 }),

  currentStepIndex: 0,
  nextStep: () => {
    const { activeBuild, currentStepIndex } = get()
    if (!activeBuild) return
    const max = activeBuild.steps.length - 1
    set({ currentStepIndex: Math.min(currentStepIndex + 1, max) })
  },
  prevStep: () => {
    const { currentStepIndex } = get()
    set({ currentStepIndex: Math.max(currentStepIndex - 1, 0) })
  },

  gameState: null,
  setGameState: (s) => set({ gameState: s }),

  tips: null,
  setTips: (t) => set({ tips: t }),

  tipsExpanded: false,
  toggleTips: () => set((state) => ({ tipsExpanded: !state.tipsExpanded })),

  builds: [],
  setBuilds: (b) => set({ builds: b }),
}))
