const oauth = require('oauth')
const { matchesText, matchesUser } = require('./tweet-filters')
const config = require('../public/config.json')

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
 * @param {string} sinceId - Fetch all tweets posted after this ID was posted.
 * @returns Array of tweets.
 */
const getTweets = (sinceId) => new Promise((resolve, reject) => {
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
      if (err) {
        reject(err)
      } else {
        const tweets = JSON.parse(data).reverse()

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

module.exports = getTweets
