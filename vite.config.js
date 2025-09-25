import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const proxyPrefix = env.VITE_APP_PROXY_PREFIX

  return defineConfig({
    base: env.VITE_APP_BASE,
    plugins: [
      vue(),
      vueJsx(),
      visualizer({
        emitFile: false,
        file: 'stats.html', //分析图生成的文件名
        open: true //如果存在本地服务端口，将在打包后自动展示
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@cps': resolve(__dirname, 'src/components'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },

    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('echarts')) {
                // 将 echarts 整体打包到一个 chunk
                return 'echarts'
              }
              if (id.includes('lodash')) {
                // 将 lodash 整体打包到一个 chunk
                return 'lodash'
              }
              if (id.includes('@arco-design/web-vue')) {
                // 方案1: 仍然作为一个整体，但监控其大小
                // return '@arco-design';

                // 方案2: 尝试更细的分割，但这需要更复杂的逻辑，例如按组件名分割
                // 例如，将一些常用组件分到一个 chunk，不常用的分到另一个
                // const arcoComponent = id.split('node_modules/@arco-design/web-vue/es/')[1]?.split('/')[0];
                // if (['button', 'input', 'form'].includes(arcoComponent)) {
                //   return 'arco-common';
                // } else {
                //   return `arco-${arcoComponent}`;
                // }
                // 暂时保持原样，但需要监控
                return '@arco-design'
              }
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },

    server: {
      host: '0.0.0.0',
      port: env.VITE_APP_PORT || process.env.port,
      proxy: {
        [proxyPrefix]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
          toProxy: true,
          rewrite: (path) => path.replace(new RegExp(`^${proxyPrefix}`), '')
        }
      }
    }
  })
}
