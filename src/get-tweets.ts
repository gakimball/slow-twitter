import oauth from 'oauth'
import { Status } from 'twitter-api-types'
import { matchesText, matchesUser } from './tweet-filters'
import { config } from './config'

const client = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.twitter_api.consumer_key,
  config.twitter_api.consumer_secret,
  '1.0A',
  null,
  'HMAC-SHA1',
)

/**
 * Get the most recent tweets on the user's timeline.
 * @param sinceId - Fetch all tweets posted after this ID was posted.
 * @returns Array of tweets.
 */
export const getTweets = (sinceId: string) => new Promise<Status[]>((resolve, reject) => {
  const params = [
    `count=${sinceId ? 200 : 50}`,
    'tweet_mode=extended',
    'include_entities=true',
  ]

  if (sinceId) {
    params.push(`since_id=${sinceId}`)
  }

  const url = `https://api.twitter.com/1.1/statuses/home_timeline.json?${params.join('&')}`

  client.get(
    url,
    config.twitter_api.access_key,
    config.twitter_api.access_secret,
    (err, data) => {
      if (err || !data) {
        reject(err)
      } else {
        const tweets: Status[] = JSON.parse(data.toString()).reverse()

        if (config.mute) {
          const filteredTweets = tweets.filter(
            tweet => config.mute.some(
              keyword => {
                if (keyword.startsWith('@')) {
                  return !matchesUser(keyword, tweet) && !matchesText(keyword, tweet)
                }

                return !matchesText(keyword, tweet)
              },
            ),
          )

          resolve(filteredTweets)
        } else {
          resolve(tweets)
        }
      }
    },
  )
})
