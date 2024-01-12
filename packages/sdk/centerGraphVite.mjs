import { VitePWA } from 'vite-plugin-pwa'

const matchCb =
  (baseUrl) =>
  ({ url }) => {
    return url.startsWith() === baseUrl && !url.pathname.startsWith('/api/')
  }

export default (config) => {
  let centerGraphExport = ''

  return [
    {
      name: 'add-centergraph',
      // load () {

      //   // this.addWatchFile()
      // },
      // handleHotUpdate({ file, server }) {
      //   console.log(file)
      //   // if (file.includes('locales') && file.endsWith('.json')) {
      //   //   console.log('Locale file updated')
      //   //   server.ws.send({
      //   //     type: "custom",
      //   //     event: "locales-update",
      //   //   });
      //   // }
      // },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // A CORS request possibly from our Shape Editor
          // We silence React refresh if requested via CORS
          if (req.headers.origin && req.url.includes('react-refresh')) {
            res.setHeader('Content-Type', 'application/javascript')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(`
              export const getRefreshReg = () => { return () => null }             
              window.$RefreshReg$ = () => { return () => null }
              export const __hmr_import = () => { return { then: () => null } }
              export const createSignatureFunctionForTransform = () => { return () => null }
            `)
            return
          }
          return next()
        })
      },
      config() {
        return {
          build: {
            rollupOptions: {
              output: {
                manualChunks: (id) => {
                  if (
                    id.toString().includes(config.apiExport) ||
                    (id.includes('packages/sdk/') && !id.includes('react'))
                  ) {
                    return 'center-graph'
                  }
                },
              },
            },
          },
        }
      },

      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `<meta name="centergraph-widgets" content="${
            centerGraphExport ? '/' + centerGraphExport : config.apiExport
          }"/>\n</head>`
        )
      },
      generateBundle(_options, bundle) {
        const fileName = Object.keys(bundle).find((name) => name.includes('center-graph') && name.endsWith('.js'))
        if (fileName) {
          centerGraphExport = fileName
        }
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: matchCb(config?.baseUrl ?? 'http://localhost:8000'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ]
}
