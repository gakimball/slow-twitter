import { getTweets } from '../dist/get-tweets.js'

getTweets().then(tweets => {
  process.stdout.write(JSON.stringify(tweets, null, 2))
})
