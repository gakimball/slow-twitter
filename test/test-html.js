const getTweets = require('../lib/get-tweets')
const createHtml = require('../lib/create-html')

getTweets().then(tweets => process.stdout.write(createHtml(tweets)))
