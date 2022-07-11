import * as path from 'node:path'
import * as fs from 'node:fs'
import { config } from './config'

export interface JSONFeed {
  version: string;
  title: string;
  description: string;
  icon: string;
  favicon: string;
  language: string;
  home_page_url: string;
  feed_url: string;
  items: Array<{
    id: string;
    title: string;
    date_published: string;
    content_html: string;
  }>;
  _last_id: string;
}

export const emptyFeed: JSONFeed = {
  version: 'https://jsonfeed.org/version/1.1',
  title: 'Twitter Digest',
  description: 'An occasional dump of Twitter posts.',
  icon: `${config.origin}/icon.png`,
  favicon: `${config.origin}/icon.png`,
  language: 'en-US',
  home_page_url: `${config.origin}/`,
  feed_url: `${config.origin}/feed.json`,
  items: [],
  _last_id: '',
}

export const feedPath = path.join(process.cwd(), 'public/feed.json')

const isError = (err: unknown): err is NodeJS.ErrnoException => err instanceof Error

/**
 * Get the current feed, or create a new one if it doesn't exist yet.
 */
export const getFeed = (): JSONFeed => {
  try {
    const file = fs.readFileSync(feedPath)

    return JSON.parse(file.toString())
  } catch (err) {
    if (isError(err) && err.code === 'ENOENT') {
      return emptyFeed
    }

    throw err
  }
}
