const path = require('path')
const fs = require('fs')
const emptyFeed = require('./empty-feed')

const feedPath = path.join(process.cwd(), 'public/feed.json')

/**
 * Get the current feed, or create a new one if it doesn't exist yet.
 * @returns {object} Current feed parsed from JSON.
 */
const getFeed = () => {
  try {
    const file = fs.readFileSync(feedPath)

    return JSON.parse(file.toString())
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }

    return emptyFeed
  }
}

exports.feedPath = feedPath
exports.getFeed = getFeed
