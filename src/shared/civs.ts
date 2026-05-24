export interface Civ {
  id: string   // lowercase, used as API key
  name: string // display name
}

export const CIVS: Civ[] = [
  { id: 'abbasid', name: 'Abbasid Dynasty' },
  { id: 'ayyubids', name: 'Ayyubids' },
  { id: 'byzantine', name: 'Byzantines' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'delhi', name: 'Delhi Sultanate' },
  { id: 'english', name: 'English' },
  { id: 'french', name: 'French' },
  { id: 'hre', name: 'Holy Roman Empire' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'jeanne', name: "Jeanne d'Arc" },
  { id: 'knights_templar', name: 'Knights Templar' },
  { id: 'malians', name: 'Malians' },
  { id: 'mongols', name: 'Mongols' },
  { id: 'order_of_the_dragon', name: 'Order of the Dragon' },
  { id: 'ottomans', name: 'Ottomans' },
  { id: 'rus', name: 'Rus' },
  { id: 'sengoku_daimyo', name: 'Sengoku Daimyo' },
  { id: 'zhu_xis_legacy', name: "Zhu Xi's Legacy" },
]

export const CIV_MAP: Record<string, string> = Object.fromEntries(
  CIVS.map((c) => [c.id, c.name])
)

export function getCivName(id: string): string {
  return CIV_MAP[id.toLowerCase()] ?? id.charAt(0).toUpperCase() + id.slice(1)
}
