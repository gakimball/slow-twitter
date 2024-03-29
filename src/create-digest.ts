import fs from 'fs'
import { format, formatRFC3339 } from 'date-fns'
import { getTweets } from './get-tweets'
import { feedPath, getFeed } from './get-feed'
import { createHtml } from './create-html'
import { config } from './config'

const MAX_FEED_ITEMS = config.max_feed_items ?? 50

/**
 * Create a new digest entry in the feed. If it's the first entry, the last 50 tweets will be
 * fetched. For subsequent entries, all tweets posted since the last digest are fetched, up to a
 * maximum of 200.
 * @paramname - Digest name as defined in the config.
 */
export const createDigest = async (name: string) => {
  try {
    const feed = getFeed()
    const tweets = await getTweets(feed._last_id)
    const date = Date.now()
    const dateStamp = formatRFC3339(date)

    // The last status in the list is the most recent
    feed._last_id = tweets.at(-1)?.id_str ?? ''

    const item = {
      id: dateStamp,
      title: `${name} Digest for ${format(date, 'MMMM d')}`,
      date_published: dateStamp,
      content_html: createHtml(tweets),
    }

    feed.items.unshift(item)

    feed.items = feed.items.slice(0, MAX_FEED_ITEMS)

    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2))
  } catch (err) {
    console.error(err)
  }
}
