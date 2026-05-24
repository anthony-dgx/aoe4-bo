import { exec } from 'child_process'
import { net } from 'electron'
import store from '../store'
import type { GameState, TeamPlayer } from '../../shared/types'

type GameEventHandler = (state: GameState) => void

let processCheckInterval: NodeJS.Timeout | null = null
let apiPollInterval: NodeJS.Timeout | null = null
let aoe4Running = false
let currentState: GameState = emptyState()
let onGameStarted: GameEventHandler | null = null
let onGameEnded: GameEventHandler | null = null

function emptyState(): GameState {
  return {
    phase: 'idle',
    gameId: null,
    startedAt: null,
    map: null,
    kind: null,
    myTeam: [],
    opponentTeam: []
  }
}

function isWindows(): boolean {
  return process.platform === 'win32'
}

async function checkAoE4Process(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isWindows()) {
      exec('tasklist /FI "IMAGENAME eq AoE4.exe" /NH', (err, stdout) => {
        resolve(!err && stdout.toLowerCase().includes('aoe4.exe'))
      })
    } else {
      // On Mac (dev mode) always return true so we can test without the game
      resolve(true)
    }
  })
}

interface Aoe4WorldPlayer {
  name: string
  profile_id?: number
  civilization: string
  rating?: number
  result?: string
}

interface Aoe4WorldGame {
  game_id: number
  started_at: string
  ongoing: boolean
  just_finished: boolean
  map?: string
  kind?: string
  teams: Aoe4WorldPlayer[][]
}

async function fetchLastGame(profileId: string): Promise<Aoe4WorldGame | null> {
  try {
    const res = await net.fetch(
      `https://aoe4world.com/api/v0/players/${profileId}/games/last`
    )
    if (!res.ok) return null
    return (await res.json()) as Aoe4WorldGame
  } catch {
    return null
  }
}

async function resolvePlayerName(profileId: string): Promise<string | null> {
  try {
    const res = await net.fetch(
      `https://aoe4world.com/api/v0/players/${profileId}`
    )
    if (!res.ok) return null
    const data = (await res.json()) as { name?: string }
    return data.name ?? null
  } catch {
    return null
  }
}

function identifyTeams(
  teams: Aoe4WorldPlayer[][],
  playerName: string
): { myTeam: TeamPlayer[]; opponentTeam: TeamPlayer[] } {
  const myTeamIndex = teams.findIndex((team) =>
    team.some((p) => p.name.toLowerCase() === playerName.toLowerCase())
  )

  const toTeamPlayer = (p: Aoe4WorldPlayer): TeamPlayer => ({
    name: p.name,
    profileId: p.profile_id ?? null,
    civilization: p.civilization,
    rating: p.rating ?? null
  })

  if (myTeamIndex === -1) {
    // Can't identify — assume first team is ours
    return {
      myTeam: (teams[0] ?? []).map(toTeamPlayer),
      opponentTeam: (teams[1] ?? []).map(toTeamPlayer)
    }
  }

  const myTeam = teams[myTeamIndex].map(toTeamPlayer)
  const opponentTeam = teams
    .filter((_, i) => i !== myTeamIndex)
    .flat()
    .map(toTeamPlayer)

  return { myTeam, opponentTeam }
}

async function pollApi(): Promise<void> {
  const profileId = store.get('settings.profileId')
  if (!profileId) return

  const game = await fetchLastGame(profileId)
  if (!game) return

  const wasOngoing = currentState.phase === 'in_game'
  const isOngoing = game.ongoing === true
  const isNew = game.started_at !== currentState.startedAt

  if (isNew && isOngoing) {
    // New game started
    let playerName = store.get('settings.playerName')
    if (!playerName) {
      const resolved = await resolvePlayerName(profileId)
      if (resolved) {
        playerName = resolved
        store.set('settings.playerName', resolved)
      }
    }

    const { myTeam, opponentTeam } = identifyTeams(game.teams, playerName ?? '')

    currentState = {
      phase: 'in_game',
      gameId: game.game_id,
      startedAt: game.started_at,
      map: game.map ?? null,
      kind: game.kind ?? null,
      myTeam,
      opponentTeam
    }

    onGameStarted?.(currentState)
  } else if (wasOngoing && !isOngoing) {
    // Game ended
    currentState = { ...currentState, phase: 'post_game' }
    onGameEnded?.(currentState)
  }
}

export function startGameDetection(handlers: {
  onGameStarted: GameEventHandler
  onGameEnded: GameEventHandler
}): void {
  onGameStarted = handlers.onGameStarted
  onGameEnded = handlers.onGameEnded

  // Check for AoE4 process every 10 seconds
  processCheckInterval = setInterval(async () => {
    const running = await checkAoE4Process()

    if (running && !aoe4Running) {
      // Game just launched
      aoe4Running = true
      // Start API polling immediately
      await pollApi()
      apiPollInterval = setInterval(pollApi, 30_000)
    } else if (!running && aoe4Running) {
      // Game closed
      aoe4Running = false
      if (apiPollInterval) {
        clearInterval(apiPollInterval)
        apiPollInterval = null
      }
      if (currentState.phase !== 'idle') {
        currentState = emptyState()
        onGameEnded?.(currentState)
      }
    }
  }, 10_000)

  // Also do an immediate check
  checkAoE4Process().then(async (running) => {
    if (running) {
      aoe4Running = true
      await pollApi()
      apiPollInterval = setInterval(pollApi, 30_000)
    }
  })
}

export function stopGameDetection(): void {
  if (processCheckInterval) {
    clearInterval(processCheckInterval)
    processCheckInterval = null
  }
  if (apiPollInterval) {
    clearInterval(apiPollInterval)
    apiPollInterval = null
  }
}

export function getCurrentState(): GameState {
  return currentState
}

export async function forceRefresh(): Promise<GameState> {
  await pollApi()
  return currentState
}

export async function lookupProfile(profileId: string): Promise<string | null> {
  return resolvePlayerName(profileId)
}
