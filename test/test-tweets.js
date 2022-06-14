const getTweets = require('../lib/get-tweets')

getTweets().then(tweets => {
  process.stdout.write(JSON.stringify(tweets, null, 2))
})
