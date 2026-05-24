import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  setInteractive: (val: boolean) => ipcRenderer.send('overlay:set-interactive', val),
  onToggle: (cb: () => void) => ipcRenderer.on('overlay:toggle', () => cb()),
  onStepAdvance: (cb: () => void) => ipcRenderer.on('step:advance', () => cb()),
  onStepRetreat: (cb: () => void) => ipcRenderer.on('step:retreat', () => cb()),
  onBuildChanged: (cb: (build: unknown) => void) =>
    ipcRenderer.on('build:active-changed', (_e, b) => cb(b)),
  onGameStarted: (cb: (state: unknown) => void) =>
    ipcRenderer.on('game:started', (_e, s) => cb(s)),
  onGameEnded: (cb: (state: unknown) => void) =>
    ipcRenderer.on('game:ended', (_e, s) => cb(s)),
  builds: {
    list: () => ipcRenderer.invoke('build:list'),
    select: (id: string) => ipcRenderer.invoke('build:select', id),
    getActive: () => ipcRenderer.invoke('build:getActive')
  },
  tips: {
    get: (myCiv: string, opponentCiv: string, gameMode: string) =>
      ipcRenderer.invoke('tips:get', { myCiv, opponentCiv, gameMode })
  }
})
