import react from '@vitejs/plugin-react'
import Checker from 'vite-plugin-checker'
import { resolve } from 'path'
import { UserConfig, defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import svgr from 'vite-plugin-svgr'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

const shouldAnalyze = process.env.ANALYZE

export default defineConfig(({ command }) => {
  const config: UserConfig = {
    base: command !== 'serve' ? '/david-portafolio/' : '',
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/'
        }
      ]
    },
    build: {
      rollupOptions: {
        plugins: !!shouldAnalyze ? [visualizer({ open: true, filename: './bundle-size/bundle.html' })] : []
      },
      sourcemap: !!shouldAnalyze
    },
    plugins: [
      react(),
      svgr(),
      Checker({
        typescript: true,
        overlay: true,
        eslint: {
          files: 'src',
          extensions: ['.ts', '.tsx']
        }
      })
    ]
  }
  return config
})
