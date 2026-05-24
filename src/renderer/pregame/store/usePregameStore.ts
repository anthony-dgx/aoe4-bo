import { create } from 'zustand'
import type { BuildOrder, GameState } from '../../../shared/types'

interface PregameStore {
  // Game state
  gameState: GameState | null
  setGameState: (s: GameState | null) => void

  // Tips
  tips: string
  tipsLoading: boolean
  appendTipChunk: (chunk: string) => void
  setTips: (t: string) => void
  setTipsLoading: (v: boolean) => void

  // Builds
  builds: BuildOrder[]
  setBuilds: (b: BuildOrder[]) => void

  // Selected build
  selectedBuildId: string | null
  setSelectedBuildId: (id: string | null) => void

  // Settings drawer
  settingsOpen: boolean
  toggleSettings: () => void

  // Import
  importUrl: string
  setImportUrl: (u: string) => void
  importing: boolean
  importError: string | null
  setImporting: (v: boolean) => void
  setImportError: (e: string | null) => void
}

export const usePregameStore = create<PregameStore>((set) => ({
  gameState: null,
  setGameState: (s) => set({ gameState: s }),

  tips: '',
  tipsLoading: false,
  appendTipChunk: (chunk) => set((state) => ({ tips: state.tips + chunk })),
  setTips: (t) => set({ tips: t }),
  setTipsLoading: (v) => set({ tipsLoading: v }),

  builds: [],
  setBuilds: (b) => set({ builds: b }),

  selectedBuildId: null,
  setSelectedBuildId: (id) => set({ selectedBuildId: id }),

  settingsOpen: false,
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),

  importUrl: '',
  setImportUrl: (u) => set({ importUrl: u }),
  importing: false,
  importError: null,
  setImporting: (v) => set({ importing: v }),
  setImportError: (e) => set({ importError: e }),
}))
