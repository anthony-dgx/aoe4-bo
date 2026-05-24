import { ipcMain, BrowserWindow } from 'electron'
import { getTips } from '../services/claudeService'

export function registerTipsHandlers(pregameWin: () => BrowserWindow | null): void {
  ipcMain.handle(
    'tips:get',
    async (_e, { myCiv, opponentCiv, gameMode }: { myCiv: string; opponentCiv: string; gameMode: string }) => {
      const win = pregameWin()

      const tips = await getTips(myCiv, opponentCiv, gameMode, (chunk) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('tips:stream-chunk', chunk)
        }
      })

      if (win && !win.isDestroyed()) {
        win.webContents.send('tips:done', tips)
      }

      return tips
    }
  )
}
