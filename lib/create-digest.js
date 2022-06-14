const fs = require('fs')
const { format, formatRFC3339 } = require('date-fns')
const getTweets = require('./get-tweets')
const { feedPath, getFeed } = require('./get-feed')
const createHtml = require('./create-html')

/**
 * Create a new digest entry in the feed. If it's the first entry, the last 50 tweets will be
 * fetched. For subsequent entries, all tweets posted since the last digest are fetched, up to a
 * maximum of 200.
 * @param {string} name - Digest name as defined in the config.
 */
const createDigest = async (name) => {
  try {
    const feed = getFeed()
    const tweets = await getTweets(feed._last_id)
    const date = Date.now()
    const dateStamp = formatRFC3339(date)

    feed._last_id = tweets[0].id_str

    const item = {
      id: dateStamp,
      title: `${name} Digest for ${format(date, 'MMMM d')}`,
      date_published: dateStamp,
      content_html: createHtml(tweets),
    }

    feed.items.unshift(item)

    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2))
  } catch (err) {
    console.error(err)
  }
}

module.exports = createDigest
