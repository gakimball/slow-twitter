import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import cron from 'node-cron'
import { createDigest } from './create-digest'
import { feedPath } from './get-feed'
import { config } from './config'

const iconPath = path.join(process.cwd(), 'icon.png')

const PORT = 8080

if (!fs.existsSync(feedPath)) {
  console.log('Creating initial digest')
  createDigest('Initial')
}

config.digests.forEach(digest => {
  console.log(`Scheduling ${digest.name} digest (${digest.cron})`)

  cron.schedule(digest.cron, () => {
    console.log(`Creating ${digest.name} digest`)
    createDigest(digest.name)
  })
})

http
  .createServer((req, res) => {
    console.log(`${req.method} ${req.url}`)

    if (req.url === '/feed.json') {
      res.setHeader('Content-Type', 'application/json')
      fs.createReadStream(feedPath).pipe(res)
    } else if (req.url === '/icon.png') {
      res.setHeader('Content-Type', 'image/png')
      fs.createReadStream(iconPath).pipe(res)
    } else {
      res.writeHead(404).end()
    }
  })
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
