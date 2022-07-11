import { getTweets } from '../dist/get-tweets.js'
import { createHtml } from '../dist/create-html.js'

getTweets().then(tweets => process.stdout.write(createHtml(tweets)))
