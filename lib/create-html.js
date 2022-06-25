const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const alter = require('alter')

Handlebars.registerHelper('fullText', tweet => {
  return alter(tweet.full_text, tweet.entities.urls.map(url => {
    if (url.expanded_url === tweet.quoted_status_permalink?.expanded) {
      return {
        start: url.indices[0] - 1,
        end: url.indices[1],
        str: '',
      }
    }

    return {
      start: url.indices[0],
      end: url.indices[1],
      str: `<a href="${url.expanded_url}">${url.expanded_url}</a>`,
    }
  }))
})

const templatePath = path.join(process.cwd(), 'lib/tweet.hbs')
const template = Handlebars.compile(fs.readFileSync(templatePath).toString())

const createHtml = tweets => template({ tweets })

module.exports = createHtml
