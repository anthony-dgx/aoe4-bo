import { ipcMain } from 'electron'
import { getCurrentState, forceRefresh } from '../services/gameDetectionService'

export function registerGameHandlers(): void {
  ipcMain.handle('game:getState', () => getCurrentState())
  ipcMain.handle('game:forceRefresh', async () => forceRefresh())
}
