import { globalShortcut, BrowserWindow } from 'electron'
import store from './store'
import { toggleOverlayVisibility } from './windows/overlayWindow'
import { showPregameWindow } from './windows/pregameWindow'

export function registerHotkeys(overlayWin: BrowserWindow): void {
  const hotkeys = store.get('settings.hotkeys')

  const safe = (key: string, fn: () => void) => {
    try {
      globalShortcut.register(key, fn)
    } catch {
      // Key already registered or invalid — skip
    }
  }

  safe(hotkeys.toggleOverlay, () => toggleOverlayVisibility())

  safe(hotkeys.nextStep, () => {
    if (!overlayWin.isDestroyed()) {
      overlayWin.webContents.send('step:advance')
    }
  })

  safe(hotkeys.prevStep, () => {
    if (!overlayWin.isDestroyed()) {
      overlayWin.webContents.send('step:retreat')
    }
  })

  safe(hotkeys.showPregame, () => showPregameWindow())
}

export function unregisterHotkeys(): void {
  globalShortcut.unregisterAll()
}

export function reregisterHotkeys(overlayWin: BrowserWindow): void {
  unregisterHotkeys()
  registerHotkeys(overlayWin)
}
