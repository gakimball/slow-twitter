const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const linkifyUrls = require('linkify-urls')

Handlebars.registerHelper('linkify', context => linkifyUrls(context))

const templatePath = path.join(process.cwd(), 'lib/tweet.hbs')
const template = Handlebars.compile(fs.readFileSync(templatePath).toString())

const createHtml = tweets => template({ tweets })

module.exports = createHtml
