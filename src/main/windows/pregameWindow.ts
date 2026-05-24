import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let pregameWin: BrowserWindow | null = null

export function createPregameWindow(): BrowserWindow {
  pregameWin = new BrowserWindow({
    width: 820,
    height: 640,
    minWidth: 720,
    minHeight: 560,
    show: false,
    frame: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f0f',
    webPreferences: {
      preload: join(__dirname, '../preload/pregame.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  pregameWin.on('ready-to-show', () => {
    pregameWin?.show()
  })

  pregameWin.on('closed', () => {
    pregameWin = null
  })

  pregameWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    pregameWin.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/pregame/index.html`)
  } else {
    pregameWin.loadFile(join(__dirname, '../renderer/pregame/index.html'))
  }

  return pregameWin
}

export function getPregameWindow(): BrowserWindow | null {
  return pregameWin
}

export function showPregameWindow(): void {
  if (!pregameWin || pregameWin.isDestroyed()) {
    createPregameWindow()
  } else {
    pregameWin.show()
    pregameWin.focus()
  }
}

export function hidePregameWindow(): void {
  if (pregameWin && !pregameWin.isDestroyed()) {
    pregameWin.hide()
  }
}
