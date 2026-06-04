const express = require('express')
const http = require('node:http')
const https = require('node:https')
const path = require('node:path')

const app = express()
const port = process.env.PORT || 3000
const distPath = path.join(__dirname, 'dist')
const apiProxyTarget = process.env.API_PROXY_TARGET || process.env.KAED_API_URL

if (apiProxyTarget) {
  const target = new URL(apiProxyTarget)
  const client = target.protocol === 'https:' ? https : http

  app.use(['/auth', '/tasks', '/jira', '/voice'], (req, res) => {
    const proxyRequest = client.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        method: req.method,
        path: `${req.originalUrl}`,
        headers: {
          ...req.headers,
          host: target.host,
        },
      },
      (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode || 500, proxyResponse.headers)
        proxyResponse.pipe(res)
      },
    )

    proxyRequest.on('error', (error) => {
      res.status(502).json({
        detail: `Backend недоступен: ${error.message}`,
      })
    })

    req.pipe(proxyRequest)
  })
}

app.use(express.static(distPath))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kaed-mini-app' })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`KAED mini app frontend is running on port ${port}`)
})
