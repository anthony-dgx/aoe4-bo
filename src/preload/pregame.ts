import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', { key, value }),
    lookupProfile: (id: string) => ipcRenderer.invoke('settings:lookupProfile', id)
  },
  builds: {
    fetch: (url: string) => ipcRenderer.invoke('build:fetch', url),
    list: () => ipcRenderer.invoke('build:list'),
    delete: (id: string) => ipcRenderer.invoke('build:delete', id),
    getActive: () => ipcRenderer.invoke('build:getActive')
  },
  game: {
    getState: () => ipcRenderer.invoke('game:getState'),
    forceRefresh: () => ipcRenderer.invoke('game:forceRefresh'),
    onStarted: (cb: (state: unknown) => void) =>
      ipcRenderer.on('game:started', (_e, s) => cb(s)),
    onEnded: (cb: (state: unknown) => void) =>
      ipcRenderer.on('game:ended', (_e, s) => cb(s))
  },
  tips: {
    get: (myCiv: string, opponentCiv: string, gameMode: string) =>
      ipcRenderer.invoke('tips:get', { myCiv, opponentCiv, gameMode }),
    onChunk: (cb: (chunk: string) => void) =>
      ipcRenderer.on('tips:stream-chunk', (_e, c) => cb(c)),
    onDone: (cb: (tips: string) => void) =>
      ipcRenderer.on('tips:done', (_e, t) => cb(t))
  },
  startTracking: (buildId: string) => ipcRenderer.send('pregame:start-tracking', buildId),
  skip: () => ipcRenderer.send('pregame:skip')
})
