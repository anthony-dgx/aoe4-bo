import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          pregame: resolve(__dirname, 'src/preload/pregame.ts'),
          overlay: resolve(__dirname, 'src/preload/overlay.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          pregame: resolve(__dirname, 'src/renderer/pregame/index.html'),
          overlay: resolve(__dirname, 'src/renderer/overlay/index.html')
        }
      }
    }
  }
})
