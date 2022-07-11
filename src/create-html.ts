import * as fs from 'node:fs'
import * as path from 'node:path'
import Handlebars from 'handlebars'
import alter from 'alter'
import { Status } from 'twitter-api-types'

Handlebars.registerHelper('fullText', (tweet: Status) => {
  const text = tweet.full_text ?? ''
  const urls = tweet.entities.urls ?? []
  const media = tweet.entities.media ?? []

  return alter(text, [
    ...urls.map(url => {
      const [start, end] = url.indices ?? [0, 0]

      // Remove the URL for the quoted status
      if (url.expanded_url === tweet.quoted_status_permalink?.expanded) {
        return {
          start: Math.max(0, start - 1),
          end,
          str: '',
        }
      }

      // Linkify external URLs
      return {
        start: start,
        end,
        str: `<a href="${url.expanded_url}">${url.expanded_url}</a>`,
      }
    }),
    // Remove the URLs for attached media
    ...media.map(item => {
      const [start, end] = item.indices ?? [0, 0]

      return {
        start: Math.max(0, start - 1),
        end,
        str: '',
      }
    })
  ])
})

const templatePath = path.join(process.cwd(), './template/tweet.hbs')
const template = Handlebars.compile(fs.readFileSync(templatePath).toString())

export const createHtml = (tweets: Status[]) => template({ tweets })
