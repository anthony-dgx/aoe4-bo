import Store from 'electron-store'
import type { StoreSchema } from '../shared/types'

const store = new Store<StoreSchema>({
  defaults: {
    settings: {
      profileId: '',
      playerName: '',
      claudeApiKey: '',
      hotkeys: {
        toggleOverlay: 'CmdOrCtrl+Shift+O',
        nextStep: 'CmdOrCtrl+Shift+]',
        prevStep: 'CmdOrCtrl+Shift+[',
        showPregame: 'CmdOrCtrl+Shift+P'
      },
      overlayPosition: { x: 20, y: 100 },
      overlaySize: { width: 340, height: 560 },
      activeBuildId: null
    },
    builds: {},
    tipsCache: {}
  }
})

export default store
