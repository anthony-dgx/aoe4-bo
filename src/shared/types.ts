export interface BuildStep {
  age: number
  type: 'step' | 'ageUp'
  time?: string
  description: string
  food?: number
  wood?: number
  gold?: number
  stone?: number
}

export interface BuildOrder {
  id: string
  title: string
  author: string
  civ: string
  season: string
  steps: BuildStep[]
  fetchedAt: number
}

export interface TeamPlayer {
  name: string
  profileId: number | null
  civilization: string
  rating: number | null
}

export type GamePhase = 'idle' | 'in_game' | 'post_game'

export interface GameState {
  phase: GamePhase
  gameId: number | null
  startedAt: string | null
  map: string | null
  kind: string | null
  myTeam: TeamPlayer[]
  opponentTeam: TeamPlayer[]
}

export interface TipsCache {
  tips: string
  myCiv: string
  opponentCiv: string
  gameMode: string
  generatedAt: number
}

export interface AppSettings {
  profileId: string
  playerName: string
  claudeApiKey: string
  hotkeys: {
    toggleOverlay: string
    nextStep: string
    prevStep: string
    showPregame: string
  }
  overlayPosition: { x: number; y: number }
  overlaySize: { width: number; height: number }
  activeBuildId: string | null
}

export interface StoreSchema {
  settings: AppSettings
  builds: Record<string, BuildOrder>
  tipsCache: Record<string, TipsCache>
}
