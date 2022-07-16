import * as path from 'node:path'
import { readFileSync } from 'node:fs'

const feedPath = path.join(process.cwd(), 'public/config.json')

interface Config {
  origin: string;
  twitter_api: {
    consumer_key: string;
    consumer_secret: string;
    access_key: string;
    access_secret: string;
  };
  digests: Array<{
    name: string;
    cron: string;
  }>;
  max_feed_items?: number;
  mute: string[];
  frontend?: string;
}

export const config: Config = JSON.parse(readFileSync(feedPath).toString())
