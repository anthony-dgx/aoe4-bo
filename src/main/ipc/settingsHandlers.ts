import { ipcMain } from 'electron'
import store from '../store'
import { lookupProfile } from '../services/gameDetectionService'
import type { AppSettings } from '../../shared/types'

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:getAll', () => store.get('settings'))

  ipcMain.handle('settings:get', (_e, key: keyof AppSettings) =>
    store.get(`settings.${key}` as any)
  )

  ipcMain.handle('settings:set', async (_e, { key, value }: { key: keyof AppSettings; value: unknown }) => {
    store.set(`settings.${key}` as any, value)

    // When profileId changes, resolve player name
    if (key === 'profileId' && typeof value === 'string' && value) {
      const name = await lookupProfile(value)
      if (name) store.set('settings.playerName', name)
      return { name }
    }

    return { ok: true }
  })

  ipcMain.handle('settings:lookupProfile', async (_e, profileId: string) => {
    const name = await lookupProfile(profileId)
    return { name }
  })
}
