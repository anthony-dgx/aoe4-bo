import { ipcMain, BrowserWindow } from 'electron'
import {
  fetchBuildOrder,
  listBuildOrders,
  deleteBuildOrder
} from '../services/buildOrderService'
import store from '../store'

export function registerBuildOrderHandlers(overlayWin: () => BrowserWindow | null): void {
  ipcMain.handle('build:fetch', async (_e, url: string) => {
    const build = await fetchBuildOrder(url)
    return build
  })

  ipcMain.handle('build:list', () => listBuildOrders())

  ipcMain.handle('build:delete', (_e, id: string) => {
    deleteBuildOrder(id)
    return { ok: true }
  })

  ipcMain.handle('build:select', (_e, id: string) => {
    store.set('settings.activeBuildId', id)
    const builds = store.get('builds') as Record<string, unknown>
    const build = builds[id]
    if (build) {
      const win = overlayWin()
      if (win && !win.isDestroyed()) {
        win.webContents.send('build:active-changed', build)
      }
    }
    return { ok: true }
  })

  ipcMain.handle('build:getActive', () => {
    const id = store.get('settings.activeBuildId')
    if (!id) return null
    const builds = store.get('builds') as Record<string, unknown>
    return builds[id] ?? null
  })
}
