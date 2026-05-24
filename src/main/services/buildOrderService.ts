import { net } from 'electron'
import store from '../store'
import type { BuildOrder, BuildStep } from '../../shared/types'

const BUILD_ID_REGEX = /aoe4guides\.com\/builds\/([A-Za-z0-9_-]+)/

function stripHtml(html: string): string {
  // Preserve image title attributes as text tokens (e.g. <img title="Food"> → Food)
  return html
    .replace(/<img[^>]+title="([^"]+)"[^>]*\/?>/gi, ' $1 ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

interface AoE4GuidesStep {
  time?: string
  description?: string
  food?: string | number
  wood?: string | number
  gold?: string | number
  stone?: string | number
  builders?: string | number
}

interface AoE4GuidesGroup {
  type?: string
  age?: number
  gameplan?: string
  steps?: AoE4GuidesStep[]
}

interface AoE4GuidesResponse {
  id: string
  title?: string
  author?: string
  civ?: string
  season?: string
  build_order?: AoE4GuidesGroup[]
  buildOrder?: AoE4GuidesGroup[]
}

function normalizeSteps(groups: AoE4GuidesGroup[]): BuildStep[] {
  const steps: BuildStep[] = []

  for (const group of groups) {
    const age = group.age ?? 1
    const type = group.type === 'ageUp' ? 'ageUp' : 'step'

    // Add an age-transition marker when type is ageUp
    if (type === 'ageUp' && group.gameplan) {
      steps.push({
        age,
        type: 'ageUp',
        description: stripHtml(group.gameplan)
      })
    }

    for (const s of group.steps ?? []) {
      steps.push({
        age,
        type: 'step',
        time: s.time,
        description: s.description ? stripHtml(s.description) : '',
        food: s.food !== undefined ? Number(s.food) : undefined,
        wood: s.wood !== undefined ? Number(s.wood) : undefined,
        gold: s.gold !== undefined ? Number(s.gold) : undefined,
        stone: s.stone !== undefined ? Number(s.stone) : undefined
      })
    }
  }

  return steps
}

export async function fetchBuildOrder(url: string): Promise<BuildOrder> {
  const match = url.match(BUILD_ID_REGEX)
  if (!match) throw new Error('Invalid aoe4guides.com URL')

  const buildId = match[1]

  // Return from cache if fresh (< 7 days)
  const cached = store.get(`builds.${buildId}` as any) as BuildOrder | undefined
  if (cached && Date.now() - cached.fetchedAt < 7 * 24 * 60 * 60 * 1000) {
    return cached
  }

  const response = await net.fetch(`https://aoe4guides.com/api/builds/${buildId}`)
  if (!response.ok) {
    throw new Error(`aoe4guides API returned ${response.status}`)
  }

  const data = (await response.json()) as AoE4GuidesResponse

  const rawGroups: AoE4GuidesGroup[] = data.build_order ?? data.buildOrder ?? []

  const buildOrder: BuildOrder = {
    id: buildId,
    title: data.title ?? 'Untitled Build',
    author: data.author ?? 'Unknown',
    civ: data.civ ?? '',
    season: data.season ?? '',
    steps: normalizeSteps(rawGroups),
    fetchedAt: Date.now()
  }

  store.set(`builds.${buildId}` as any, buildOrder)

  return buildOrder
}

export function listBuildOrders(): BuildOrder[] {
  const builds = store.get('builds') as Record<string, BuildOrder>
  return Object.values(builds)
}

export function deleteBuildOrder(id: string): void {
  const builds = store.get('builds') as Record<string, BuildOrder>
  delete builds[id]
  store.set('builds', builds)
}
