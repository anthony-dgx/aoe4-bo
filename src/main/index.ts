import { app, Tray, Menu, nativeImage, ipcMain } from 'electron'
import { join } from 'path'
import { createPregameWindow, getPregameWindow, showPregameWindow } from './windows/pregameWindow'
import { createOverlayWindow, getOverlayWindow, setOverlayInteractive } from './windows/overlayWindow'
import { registerSettingsHandlers } from './ipc/settingsHandlers'
import { registerBuildOrderHandlers } from './ipc/buildOrderHandlers'
import { registerGameHandlers } from './ipc/gameHandlers'
import { registerTipsHandlers } from './ipc/tipsHandlers'
import { registerHotkeys, unregisterHotkeys } from './hotkeys'
import { startGameDetection, stopGameDetection } from './services/gameDetectionService'
import store from './store'
import type { GameState } from '../shared/types'

let tray: Tray | null = null

app.on('ready', () => {
  const overlayWin = createOverlayWindow()
  const pregameWin = createPregameWindow()

  // System tray
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/icon.png'))
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon)
  tray.setToolTip('AoE4 Companion')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show Pre-game', click: () => showPregameWindow() },
      { label: 'Toggle Overlay', click: () => overlayWin.isVisible() ? overlayWin.hide() : overlayWin.show() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ])
  )
  tray.on('click', () => showPregameWindow())

  // Register IPC handlers
  registerSettingsHandlers()
  registerBuildOrderHandlers(() => getOverlayWindow())
  registerGameHandlers()
  registerTipsHandlers(() => getPregameWindow())

  // Overlay interaction toggle
  ipcMain.on('overlay:set-interactive', (_e, interactive: boolean) => {
    setOverlayInteractive(interactive)
  })

  ipcMain.on('pregame:start-tracking', (_e, buildId: string) => {
    const builds = store.get('builds') as Record<string, unknown>
    const build = builds[buildId]
    if (build && !overlayWin.isDestroyed()) {
      overlayWin.webContents.send('build:active-changed', build)
      store.set('settings.activeBuildId', buildId)
    }
    pregameWin.hide()
    overlayWin.show()
  })

  ipcMain.on('pregame:skip', () => {
    pregameWin.hide()
    overlayWin.show()
  })

  // Global hotkeys
  registerHotkeys(overlayWin)

  // Game detection
  startGameDetection({
    onGameStarted: (state: GameState) => {
      // Push state to both windows
      if (!pregameWin.isDestroyed()) {
        pregameWin.webContents.send('game:started', state)
        showPregameWindow()
      }
      if (!overlayWin.isDestroyed()) {
        overlayWin.webContents.send('game:started', state)
      }
    },
    onGameEnded: (state: GameState) => {
      if (!pregameWin.isDestroyed()) {
        pregameWin.webContents.send('game:ended', state)
      }
      if (!overlayWin.isDestroyed()) {
        overlayWin.webContents.send('game:ended', state)
      }
    }
  })
})

app.on('window-all-closed', (e: Event) => {
  // Keep app running in tray — don't quit on window close
  e.preventDefault()
})

app.on('will-quit', () => {
  unregisterHotkeys()
  stopGameDetection()
})

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
  app.quit()
}
