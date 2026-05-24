import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import store from '../store'

let overlayWin: BrowserWindow | null = null

export function createOverlayWindow(): BrowserWindow {
  const pos = store.get('settings.overlayPosition')
  const size = store.get('settings.overlaySize')

  overlayWin = new BrowserWindow({
    x: pos.x,
    y: pos.y,
    width: size.width,
    height: size.height,
    minWidth: 260,
    minHeight: 300,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    hasShadow: false,
    webPreferences: {
      preload: join(__dirname, '../preload/overlay.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  overlayWin.setAlwaysOnTop(true, 'screen-saver')
  overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  // Start click-through by default
  overlayWin.setIgnoreMouseEvents(true, { forward: true })

  overlayWin.on('ready-to-show', () => {
    overlayWin?.show()
  })

  overlayWin.on('closed', () => {
    overlayWin = null
  })

  overlayWin.on('resize', () => {
    if (!overlayWin) return
    const [width, height] = overlayWin.getSize()
    store.set('settings.overlaySize', { width, height })
  })

  overlayWin.on('move', () => {
    if (!overlayWin) return
    const [x, y] = overlayWin.getPosition()
    store.set('settings.overlayPosition', { x, y })
  })

  overlayWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    overlayWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/overlay/index.html`)
  } else {
    overlayWin.loadFile(join(__dirname, '../renderer/overlay/index.html'))
  }

  return overlayWin
}

export function getOverlayWindow(): BrowserWindow | null {
  return overlayWin
}

export function setOverlayInteractive(interactive: boolean): void {
  if (!overlayWin || overlayWin.isDestroyed()) return
  if (interactive) {
    overlayWin.setIgnoreMouseEvents(false)
  } else {
    overlayWin.setIgnoreMouseEvents(true, { forward: true })
  }
}

export function toggleOverlayVisibility(): void {
  if (!overlayWin || overlayWin.isDestroyed()) return
  if (overlayWin.isVisible()) {
    overlayWin.hide()
  } else {
    overlayWin.show()
  }
}
